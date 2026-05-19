
// this is main file
// again claude ai
import mongoose from "mongoose";
import Booking from "../models/bookingModel.js";
import Movie from "../models/movieModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import { sendBookingConfirmationEmail } from "../utils/emailService.js";
dotenv.config();

const CLIENT_URL = "http://localhost:5173";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_API_VERSION = "2022-11-15";
const RECLINER_ROWS = new Set(["D", "E"]);
const BLOCKING_STATUSES = ["pending", "paid", "confirmed", "active", "upcoming"];

function getStripeOrThrow() {
  if (!STRIPE_SECRET_KEY) throw new Error('Missing STRIPE_SECRET_KEY');
  return new Stripe(STRIPE_SECRET_KEY, { apiVersion: STRIPE_API_VERSION });
}

function normalizeShowtimeToMinute(input) {
  let d = new Date(input);
  if (isNaN(d.getTime())) {
    try { d = new Date(decodeURIComponent(String(input))); } catch { d = new Date(String(input)); }
  }
  if (isNaN(d.getTime())) throw new Error("Invalid showtime");
  d.setSeconds(0, 0);
  return d;
}

function buildMovieMatchClause(movieId, movieName) {
  const push = (arr, obj) => { if (obj && Object.keys(obj).length) arr.push(obj); };
  const clauses = [];
  if (movieId) {
    const mid = String(movieId).trim();
    if (mid) {
      if (mongoose.Types.ObjectId.isValid(mid)) {
        push(clauses, { "movie.id": new mongoose.Types.ObjectId(mid) });
        push(clauses, { movieId: new mongoose.Types.ObjectId(mid) });
      }
      push(clauses, { "movie.id": mid });
      push(clauses, { movieId: mid });
    }
  }
  if (movieName) {
    const mname = String(movieName).trim();
    if (mname) {
      push(clauses, { "movie.title": mname });
      push(clauses, { movieName: mname });
      push(clauses, { "movie.movieName": mname });
    }
  }
  const seen = new Set();
  const unique = [];
  for (const c of clauses) {
    const k = JSON.stringify(c);
    if (!seen.has(k)) { seen.add(k); unique.push(c); }
  }
  return unique;
}

function computeTotalPaiseFromSeats(movie = {}, seats = [], options = {}) {
  const allowClientPrice = options.allowClientPrice === true;
  const standardRupee = Number(movie?.seatPrices?.standard ?? movie?.price ?? 0) || 0;
  const standardPaise = Math.round(standardRupee * 100);
  const reclinerDefined = typeof movie?.seatPrices?.recliner !== "undefined" && movie?.seatPrices?.recliner !== null;
  const reclinerPaise = reclinerDefined
    ? Math.round(Number(movie.seatPrices.recliner) * 100)
    : Math.round(standardPaise * 1.5);
  let total = 0;
  for (const s of seats) {
    if (!s) continue;
    if (allowClientPrice && typeof s === "object" && s.price !== undefined && s.price !== null) {
      const p = Number(s.price);
      if (!Number.isNaN(p) && p >= 0) { total += Math.round(p * 100); continue; }
    }
    let seatId = typeof s === "string" ? s : String(s.seatId || s.id || s.name || "");
    seatId = String(seatId).trim();
    if (!seatId) continue;
    const row = seatId.charAt(0).toUpperCase();
    total += RECLINER_ROWS.has(row) ? reclinerPaise : standardPaise;
  }
  return Math.max(0, Math.round(total));
}

function normalizeSeatsFromInput(rawSeats = [], seatIdsFromBody = [], movie = {}) {
  const normalized = [];
  const deriveServerPrice = (row) => {
    const isRecliner = RECLINER_ROWS.has(row);
    const base = Number(movie?.seatPrices?.standard ?? movie?.price ?? 0);
    if (isRecliner) return Number(movie?.seatPrices?.recliner ?? Math.round(base * 1.5));
    return base;
  };
  if (Array.isArray(rawSeats) && rawSeats.length > 0) {
    if (typeof rawSeats[0] === "object") {
      for (const s of rawSeats) {
        const seatIdVal = String(s.seatId || s.id || s).trim().toUpperCase();
        if (!seatIdVal) continue;
        const row = seatIdVal.charAt(0).toUpperCase();
        const type = s.type || (RECLINER_ROWS.has(row) ? "recliner" : "standard");
        let price = 0;
        if (s.price !== undefined && s.price !== null) {
          const p = Number(s.price);
          if (!Number.isNaN(p) && p >= 0) price = p;
        } else price = deriveServerPrice(row);
        normalized.push({ seatId: seatIdVal, type, price });
      }
    } else {
      for (const sid of rawSeats) {
        const seatIdVal = String(sid).trim().toUpperCase();
        if (!seatIdVal) continue;
        const row = seatIdVal.charAt(0).toUpperCase();
        const type = RECLINER_ROWS.has(row) ? "recliner" : "standard";
        normalized.push({ seatId: seatIdVal, type, price: deriveServerPrice(row) });
      }
    }
  } else if (Array.isArray(seatIdsFromBody) && seatIdsFromBody.length > 0) {
    for (const sid of seatIdsFromBody) {
      const seatIdVal = String(sid).trim().toUpperCase();
      if (!seatIdVal) continue;
      const row = seatIdVal.charAt(0).toUpperCase();
      const type = RECLINER_ROWS.has(row) ? "recliner" : "standard";
      normalized.push({ seatId: seatIdVal, type, price: deriveServerPrice(row) });
    }
  }
  return normalized;
}

/* ── createBooking ─────────────────────────────────────────────────────── */
export async function createBooking(req, res) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Authentication required" });

    const body = req.body || {};
    const movieId = body.movieId || null;
    const movieName = body.movieName || body.movie?.title || "";
    const auditorium = body.audi || body.auditorium || "Audi 1";
    const rawSeats = Array.isArray(body.seats) ? body.seats.filter(Boolean) : [];
    const seatIdsFromBody = Array.isArray(body.seatIds) ? body.seatIds.filter(Boolean) : [];
    const customer = String(body.customer || req.user?.name || req.user?.fullName || "Guest");
    const paymentMethod = String(body.paymentMethod || "card").toLowerCase();
    const currency = String(body.currency || "inr").toLowerCase();

    // ── Get email from body OR from req.user ──────────────────────────────
    const email = String(
      body.email ||
      req.user?.email ||
      ""
    ).trim().toLowerCase();

    console.log("📧 Booking email received:", email || "❌ EMPTY");

    if (!body.showtime || (rawSeats.length === 0 && seatIdsFromBody.length === 0)) {
      return res.status(400).json({ success: false, message: "Missing required fields (showtime/seats)" });
    }

    let showtime;
    try { showtime = normalizeShowtimeToMinute(body.showtime); }
    catch { return res.status(400).json({ success: false, message: "Invalid showtime" }); }

    let movie = null;
    if (movieId && mongoose.Types.ObjectId.isValid(String(movieId))) {
      movie = await Movie.findById(movieId).lean().exec().catch(() => null);
    } else if (movieName) {
      movie = await Movie.findOne({ $or: [{ title: movieName }, { movieName }] }).lean().exec().catch(() => null);
    }

    // ── If email still empty, try to get from User model ─────────────────
    let finalEmail = email;
    if (!finalEmail && req.user?._id) {
      const { default: User } = await import("../models/userModel.js");
      const userDoc = await User.findById(req.user._id).lean().exec().catch(() => null);
      finalEmail = userDoc?.email || "";
      console.log("📧 Email from User model:", finalEmail || "❌ Still empty");
    }

    const normalizedSeats = normalizeSeatsFromInput(rawSeats, seatIdsFromBody, movie);
    if (normalizedSeats.length === 0) return res.status(400).json({ success: false, message: "No valid seats" });

    const totalPaise = computeTotalPaiseFromSeats(movie, normalizedSeats, { allowClientPrice: true });
    if (!totalPaise || totalPaise <= 0) return res.status(400).json({ success: false, message: "Computed amount is zero" });
    const totalMain = Number((totalPaise / 100).toFixed(2));

    const startWindow = new Date(showtime);
    const endWindow = new Date(startWindow.getTime() + 60 * 1000);
    const conflictQuery = {
      showtime: { $gte: startWindow, $lt: endWindow },
      auditorium,
      status: { $in: BLOCKING_STATUSES }
    };
    const movieClauses = buildMovieMatchClause(movieId, movieName);
    if (movieClauses.length > 0) conflictQuery.$or = movieClauses;

    const existingBookings = await Booking.find(conflictQuery, { seats: 1 }).lean().exec();
    const occupiedSeats = new Set();
    for (const b of existingBookings || []) {
      const seats = Array.isArray(b.seats) ? b.seats : [];
      for (const seat of seats) {
        const seatId = typeof seat === "string"
          ? seat.trim().toUpperCase()
          : (seat?.seatId || seat?.id || "").toString().trim().toUpperCase();
        if (seatId) occupiedSeats.add(seatId);
      }
    }

    const seatIdList = Array.from(new Set(normalizedSeats.map(s => s.seatId)));

    const movieSnapshot = movie
      ? {
        id: movie._id,
        title: movie.movieName || movie.title || "",
        poster: movie.poster || movie.thumbnail || "",
        category: Array.isArray(movie.categories) ? movie.categories[0] || "" : movie.category || "",
        durationMins: movie.duration || movie.runtime || 0,
        rating: movie.rating || null
      }
      : {
        id: movieId && mongoose.Types.ObjectId.isValid(String(movieId)) ? new mongoose.Types.ObjectId(movieId) : undefined,
        title: movieName || "",
        poster: "",
        category: "",
        durationMins: 0
      };

    const doc = {
      userId: req.user?._id ? new mongoose.Types.ObjectId(req.user._id) : undefined,
      customer,
      email: finalEmail,   // ← save email in booking
      movie: movieSnapshot,
      movieId: movieSnapshot.id,
      movieName: movieSnapshot.title,
      showtime,
      auditorium,
      seats: normalizedSeats,
      basePrice: movie?.seatPrices?.standard ?? movie?.price ?? 0,
      amount: totalMain,
      amountPaise: totalPaise,
      currency: (currency || "INR").toUpperCase(),
      status: paymentMethod === "card" ? "pending" : "confirmed",
      paymentStatus: paymentMethod === "card" ? "pending" : "paid",
      paymentMethod,
      meta: { rawRequest: { seatIds: seatIdList, clientSeats: rawSeats } }
    };

    const booking = await Booking.create(doc);

    // ── Send email for non-card payments immediately ──────────────────────
    if (paymentMethod !== "card" && finalEmail) {
      try {
        await sendBookingConfirmationEmail({
          toEmail: finalEmail,
          customerName: customer,
          movieTitle: movieSnapshot.title,
          showtime: showtime,
          auditorium: auditorium,
          seats: normalizedSeats,
          totalAmount: totalMain,
          bookingId: String(booking._id),
        });
        console.log("✅ Email sent for non-card booking to:", finalEmail);
      } catch (emailErr) {
        console.error("❌ Email failed (non-fatal):", emailErr.message);
      }
    }

    if (paymentMethod === "card") {
      let stripe;
      try { stripe = getStripeOrThrow(); }
      catch (err) {
        await Booking.findByIdAndDelete(booking._id).catch(() => { });
        return res.status(500).json({ success: false, message: "Payment not configured" });
      }

      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          customer_email: finalEmail || undefined, // ← pass email to Stripe too
          line_items: [{
            price_data: {
              currency,
              product_data: {
                name: booking.movie.title || "Movie Booking",
                description: `Seats: ${seatIdList.join(", ")} — ${auditorium}`
              },
              unit_amount: totalPaise
            },
            quantity: 1
          }],
          success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${CLIENT_URL}/cancel?session_id={CHECKOUT_SESSION_ID}`,
          metadata: {
            bookingId: String(booking._id),
            email: finalEmail,   // ← also store in Stripe metadata
            seats: JSON.stringify(seatIdList),
            auditorium,
            showtime: showtime.toISOString()
          }
        });

        await Booking.findByIdAndUpdate(booking._id, {
          paymentSessionId: session.id,
          stripeSession: { id: session.id, url: session.url || null }
        }).exec();

        return res.status(201).json({
          success: true,
          message: "Booking created (pending payment)",
          booking: { id: booking._id, status: booking.status, amount: doc.amount, amountPaise: doc.amountPaise, currency: doc.currency },
          checkout: { id: session.id, url: session.url }
        });
      } catch (stripeErr) {
        await Booking.findByIdAndDelete(booking._id).catch(() => { });
        return res.status(500).json({ success: false, message: "Failed to create Stripe session", error: String(stripeErr.message || stripeErr) });
      }
    }

    return res.status(201).json({
      success: true,
      message: "Booking created",
      booking: { id: booking._id, status: booking.status, amount: booking.amount }
    });
  } catch (err) {
    console.error("createBooking error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
}

/* ── getBooking ────────────────────────────────────────────────────────── */
export async function getBooking(req, res) {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Authentication required.' });
    const userId = String(req.user._id || req.user.id);
    const { paymentStatus, status } = req.query;
    const q = { userId };
    if (paymentStatus && String(paymentStatus).toLowerCase() !== "all") {
      q.paymentStatus = String(paymentStatus).toLowerCase();
    } else if (status && String(status).toLowerCase() !== "all") {
      q.status = String(status).toLowerCase();
    } else {
      q.paymentStatus = "paid";
    }
    const items = await Booking.find(q).sort({ createdAt: -1 }).lean().exec();
    return res.json({ success: true, items });
  } catch (err) {
    console.log("getBooking error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
}

/* ── listBookings ──────────────────────────────────────────────────────── */
export async function listBookings(req, res) {
  try {
    const { movieId, page = 1, limit = 100, paymentStatus, status } = req.query;
    const q = {};
    if (movieId) {
      if (mongoose.Types.ObjectId.isValid(String(movieId))) q.movieId = new mongoose.Types.ObjectId(String(movieId));
      else q.movieName = String(movieId);
    }
    if (paymentStatus && String(paymentStatus).toLowerCase() !== "all") {
      q.paymentStatus = String(paymentStatus).toLowerCase();
    } else if (status && String(status).toLowerCase() !== "all") {
      q.status = String(status).toLowerCase();
    } else {
      q.paymentStatus = "paid";
    }
    const pg = Math.max(1, Number(page) || 1);
    const lim = Math.min(1000, Number(limit) || 100);
    const total = await Booking.countDocuments(q).exec();
    const items = await Booking.find(q).sort({ createdAt: -1 }).skip((pg - 1) * lim).limit(lim).lean().exec();
    return res.json({ success: true, total, page: pg, limit: lim, items });
  } catch (err) {
    console.log("listBookings error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
}

/* ── deleteBooking ─────────────────────────────────────────────────────── */
export async function deleteBooking(req, res) {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: 'Invalid id' });
    const b = await Booking.findByIdAndDelete(id).lean().exec();
    if (!b) return res.status(404).json({ success: false, message: 'Booking not found' });
    return res.json({ success: true, message: 'Booking Deleted' });
  } catch (err) {
    console.error("deleteBooking error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

/* ── getOccupiedSeats ──────────────────────────────────────────────────── */
export async function getOccupiedSeats(req, res) {
  try {
    const { movieId, movieName, showtime: showtimeRaw, audi: audiRaw } = req.query;
    if (!showtimeRaw) return res.status(400).json({ success: false, message: "showtime query param required" });
    const auditorium = String(audiRaw || req.query.auditorium || "Audi 1");
    let parsed;
    try { parsed = normalizeShowtimeToMinute(showtimeRaw); }
    catch { return res.status(400).json({ success: false, message: "Invalid showtime" }); }

    const start = new Date(parsed);
    const end = new Date(start.getTime() + 60 * 1000);
    const q = { showtime: { $gte: start, $lt: end }, auditorium, status: { $in: BLOCKING_STATUSES } };
    const movieClauses = buildMovieMatchClause(movieId, movieName);
    if (movieClauses.length > 0) q.$or = movieClauses;

    const docs = await Booking.find(q, { seats: 1 }).lean().exec();
    const occupiedSet = new Set();
    for (const d of docs || []) {
      const sarr = Array.isArray(d.seats) ? d.seats : [];
      for (const s of sarr) {
        if (!s) continue;
        let seatId = "";
        if (typeof s === "string") seatId = s.trim().toUpperCase();
        else if (s.seatId) seatId = String(s.seatId).trim().toUpperCase();
        else if (s.id) seatId = String(s.id).trim().toUpperCase();
        if (seatId) occupiedSet.add(seatId);
      }
    }
    return res.json({ success: true, occupied: [...occupiedSet] });
  } catch (err) {
    console.error("getOccupiedSeats error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
}

/* ── confirmPayment ────────────────────────────────────────────────────── */
export async function confirmPayment(req, res) {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ success: false, message: 'session_id required' });

    let stripe;
    try { stripe = getStripeOrThrow(); }
    catch (err) { return res.status(500).json({ success: false, message: 'Payment not configured', error: err.message }); }

    const sessionObj = await stripe.checkout.sessions.retrieve(session_id);
    if (!sessionObj) return res.status(400).json({ success: false, message: 'Session not found' });
    if (sessionObj.payment_status !== 'paid') {
      return res.status(400).json({ success: false, message: 'Payment not completed' });
    }

    const bookingId = sessionObj.metadata?.bookingId;
    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ success: false, message: "Invalid bookingId in session metadata" });
    }

    // ── Find booking FIRST to get saved email ────────────────────────────
    const existingBooking = await Booking.findById(bookingId).lean().exec();
    if (!existingBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // ── Update booking status ─────────────────────────────────────────────
    const booking = await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "paid",
      status: "confirmed",
      paymentIntentId: sessionObj.payment_intent || ""
    }, { new: true }).exec();

    // ── Get email from multiple sources ───────────────────────────────────
    const customerEmail =
      existingBooking.email ||           // from booking doc
      sessionObj.metadata?.email ||      // from Stripe metadata
      sessionObj.customer_email ||       // from Stripe session
      "";

    console.log("📧 confirmPayment — email sources:");
    console.log("   booking.email:", existingBooking.email || "❌ empty");
    console.log("   metadata.email:", sessionObj.metadata?.email || "❌ empty");
    console.log("   customer_email:", sessionObj.customer_email || "❌ empty");
    console.log("   Final email:", customerEmail || "❌ NO EMAIL FOUND");

    // ── Send confirmation email ───────────────────────────────────────────
    if (customerEmail) {
      try {
        await sendBookingConfirmationEmail({
          toEmail: customerEmail,
          customerName: booking.customer || existingBooking.customer || "Customer",
          movieTitle: booking.movie?.title || existingBooking.movie?.title || "Movie",
          showtime: booking.showtime || existingBooking.showtime,
          auditorium: booking.auditorium || existingBooking.auditorium,
          seats: booking.seats || existingBooking.seats,
          totalAmount: booking.amount || existingBooking.amount,
          bookingId: String(booking._id),
        });
        console.log("✅ Confirmation email sent to:", customerEmail);
      } catch (emailErr) {
        console.error("❌ Email send failed:", emailErr.message);
      }
    } else {
      console.error("❌ No email found — confirmation email NOT sent!");
    }

    return res.json({ success: true, booking });
  } catch (err) {
    console.error("confirmPayment error:", err?.stack || err);
    return res.status(500).json({ success: false, message: "Server error", error: String(err.message || err) });
  }
}

export default { createBooking, getBooking, listBookings, deleteBooking, getOccupiedSeats, confirmPayment };















