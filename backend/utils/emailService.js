
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// ── Load .env file explicitly ──────────────────────────────────────────────
dotenv.config();

// ── Debug — remove after testing ──────────────────────────────────────────
console.log("📧 EMAIL_USER:", process.env.EMAIL_USER ? "✅ Found" : "❌ Missing");
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Found" : "❌ Missing");

// ── Create transporter ─────────────────────────────────────────────────────
function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(
      "EMAIL_USER or EMAIL_PASS missing in .env file!\n" +
      "Add these lines to backend/.env:\n" +
      "EMAIL_USER=yourgmail@gmail.com\n" +
      "EMAIL_PASS=your16digitapppassword"
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

// ── Send Booking Confirmation Email ────────────────────────────────────────
export async function sendBookingConfirmationEmail({
  toEmail,
  customerName,
  movieTitle,
  showtime,
  auditorium,
  seats,
  totalAmount,
  bookingId,
}) {
  const seatList = Array.isArray(seats)
    ? seats.map((s) => (typeof s === "string" ? s : s.seatId || s.id || ""))
           .filter(Boolean)
           .join(", ")
    : seats || "N/A";

  const formattedDate = showtime
    ? new Date(showtime).toLocaleString("en-IN", {
        weekday: "long",
        year:    "numeric",
        month:   "long",
        day:     "numeric",
        hour:    "2-digit",
        minute:  "2-digit",
      })
    : "N/A";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:Arial,sans-serif; background:#f1f5f9; color:#333; }
    .wrapper { max-width:600px; margin:30px auto; background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.1); }
    .header { background:linear-gradient(135deg,#dc2626,#b91c1c); padding:32px 24px; text-align:center; }
    .header h1 { color:#fff; font-size:28px; font-weight:800; letter-spacing:2px; }
    .header p { color:rgba(255,255,255,0.85); font-size:13px; margin-top:6px; }
    .ticket { background:#1a1e2a; padding:28px 24px; }
    .movie-title { color:#fff; font-size:24px; font-weight:700; margin-bottom:8px; }
    .badge { display:inline-block; background:rgba(220,38,38,0.2); border:1px solid rgba(220,38,38,0.4); color:#fca5a5; font-size:11px; font-weight:600; padding:3px 10px; border-radius:20px; margin-bottom:20px; }
    .divider { border:none; border-top:1px dashed rgba(255,255,255,0.15); margin:20px 0; }
    .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .item { background:rgba(255,255,255,0.05); border-radius:10px; padding:12px 14px; }
    .label { color:#8890a4; font-size:11px; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:4px; }
    .value { color:#fff; font-size:14px; font-weight:600; }
    .seats-box { background:rgba(220,38,38,0.1); border:1px solid rgba(220,38,38,0.25); border-radius:10px; padding:14px; margin-top:14px; }
    .seats-label { color:#fca5a5; font-size:11px; text-transform:uppercase; margin-bottom:6px; }
    .seats-value { color:#fff; font-size:16px; font-weight:700; letter-spacing:2px; }
    .amount-box { background:linear-gradient(135deg,#dc2626,#b91c1c); border-radius:10px; padding:16px; margin-top:14px; text-align:center; }
    .amount-label { color:rgba(255,255,255,0.8); font-size:12px; margin-bottom:4px; }
    .amount-value { color:#fff; font-size:28px; font-weight:800; }
    .body { padding:24px; }
    .greeting { font-size:16px; margin-bottom:12px; }
    .message { font-size:14px; color:#555; line-height:1.6; margin-bottom:20px; }
    .instructions { background:#f8fafc; border-radius:10px; padding:16px; margin-bottom:20px; }
    .instructions h3 { font-size:14px; color:#333; margin-bottom:10px; }
    .instructions li { font-size:13px; color:#555; margin-bottom:6px; list-style:none; }
    .footer { background:#1a1e2a; padding:20px; text-align:center; }
    .footer p { color:#8890a4; font-size:12px; }
    .footer strong { color:#e63946; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>🎬 CINEVERSE</h1>
      <p>Your booking is confirmed!</p>
    </div>

    <div class="ticket">
      <div class="movie-title">${movieTitle || "Movie"}</div>
      <div class="badge">✅ BOOKING CONFIRMED</div>
      <hr class="divider"/>

      <div class="grid">
        <div class="item">
          <div class="label">📅 Show Time</div>
          <div class="value">${formattedDate}</div>
        </div>
        <div class="item">
          <div class="label">🎭 Auditorium</div>
          <div class="value">${auditorium || "N/A"}</div>
        </div>
        <div class="item">
          <div class="label">👤 Customer</div>
          <div class="value">${customerName || "Guest"}</div>
        </div>
        <div class="item">
          <div class="label">🎫 Booking ID</div>
          <div class="value" style="font-size:11px">${bookingId || "N/A"}</div>
        </div>
      </div>

      <div class="seats-box">
        <div class="seats-label">💺 Your Seats</div>
        <div class="seats-value">${seatList}</div>
      </div>

      <div class="amount-box">
        <div class="amount-label">Total Amount Paid</div>
        <div class="amount-value">₹${Number(totalAmount || 0).toLocaleString("en-IN")}</div>
      </div>
    </div>

    <div class="body">
      <p class="greeting">Hello <strong>${customerName || "there"}</strong>! 👋</p>
      <p class="message">
        Your movie ticket has been successfully booked! 🎉
        We're excited to have you at <strong>${movieTitle}</strong>.
        Please keep this email as your booking reference.
      </p>

      <div class="instructions">
        <h3>📋 Important Instructions:</h3>
        <ul>
          <li>✅ Arrive at least 15 minutes before show time</li>
          <li>📱 Show this email at the entrance</li>
          <li>🪪 Carry a valid photo ID for verification</li>
          <li>🍿 Outside food and beverages are not allowed</li>
          <li>📵 Please switch your phone to silent during the movie</li>
        </ul>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for choosing <strong>CINEVERSE</strong>! 🎬</p>
      <p style="margin-top:6px;">Enjoy your movie experience! 🍿</p>
    </div>
  </div>
</body>
</html>
  `;

  // Create transporter fresh each time (reads .env correctly)
  const transporter = createTransporter();

  await transporter.sendMail({
    from:    `"🎬 CINEVERSE" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: `✅ Booking Confirmed — ${movieTitle} | CINEVERSE`,
    html:    htmlContent,
  });

  console.log(`✅ Confirmation email sent to ${toEmail}`);
}