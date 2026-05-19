


import mongoose from "mongoose";
import Movie from "../models/movieModel.js";
import path from "path";
import fs from "fs";

const API_BASE_URL = "http://localhost:5000";

/* ── helpers ─────────────────────────────────────────────── */

// ← FIXED: returns Cloudinary URLs as-is, only builds localhost for local files
const getUploadUrl = (val) => {
  if (!val) return null;
  const raw = String(val).trim();
  if (!raw) return null;
  if (raw.toLowerCase() === "null" || raw.toLowerCase() === "undefined") return null;
  // Already a full URL (Cloudinary, TMDB, any http/https) — return as-is
  if (/^(https?:\/\/)/.test(raw)) return raw;
  // Cloudinary path without domain — skip it (invalid)
  if (raw.startsWith("cineverse/") || raw.includes("/image/upload/")) return null;
  // Local file — build localhost URL
  const cleaned = raw.replace(/^\/?uploads[\\\/]/, "").replace(/\\/g, "/");
  if (!cleaned) return null;
  return `${API_BASE_URL}/uploads/${cleaned}`;
};

const extractFilenameFromUrl = (u) => {
  if (!u || typeof u !== "string") return null;
  const parts = u.split("/uploads/");
  if (parts[1]) return parts[1];
  if (u.startsWith("uploads/")) return u.replace(/^uploads\//, "");
  return /^[^\/]+\.[a-zA-Z0-9]+$/.test(u) ? u : null;
};

const tryUnlinkUploadUrl = (urlOrFilename) => {
  // Don't try to delete Cloudinary URLs
  if (urlOrFilename && urlOrFilename.includes("cloudinary")) return;
  const fn = extractFilenameFromUrl(urlOrFilename);
  if (!fn) return;
  const filepath = path.join(process.cwd(), "uploads", fn);
  fs.unlink(filepath, (err) => {
    if (err) console.warn("Failed to unlink file", filepath, err?.message || err);
  });
};

const safeParseJSON = (v) => {
  if (!v) return null;
  if (typeof v === "object") return v;
  try { return JSON.parse(v); } catch { return null; }
};

const normalizeLatestPersonFilename = (value) => {
  if (!value) return null;
  if (typeof value === "string") {
    // If Cloudinary URL return as-is
    if (/^(https?:\/\/)/.test(value)) return value;
    const fn = extractFilenameFromUrl(value);
    return fn || value;
  }
  if (typeof value === "object") {
    const candidate = value.filename || value.path || value.url || value.file || value.image || value.preview || null;
    return candidate ? normalizeLatestPersonFilename(candidate) : null;
  }
  return null;
};

const personToPreview = (p) => {
  if (!p) return { name: "", role: "", preview: null };
  const candidate = p.preview || p.file || p.File || p.image || p.url || null;
  return { name: p.name || "", role: p.role || "", preview: candidate ? getUploadUrl(candidate) : null };
};

const buildLatestTrailerPeople = (arr = []) =>
  (arr || []).map((p) => ({
    name: (p && p.name) || "",
    role: (p && p.role) || "",
    file: normalizeLatestPersonFilename(p && (p.file || p.preview || p.url || p.image))
  }));

const enrichLatestTrailerForOutput = (lt = {}) => {
  const copy = { ...lt };
  copy.thumbnail = copy.thumbnail ? getUploadUrl(copy.thumbnail) : copy.thumbnail || null;
  const mapPerson = (p) => {
    const c = { ...(p || {}) };
    c.preview = c.file ? getUploadUrl(c.file) : (c.preview ? getUploadUrl(c.preview) : null);
    c.name = c.name || "";
    c.role = c.role || "";
    return c;
  };
  copy.directors = (copy.directors || []).map(mapPerson);
  copy.producers = (copy.producers || []).map(mapPerson);
  copy.singers   = (copy.singers   || []).map(mapPerson);
  return copy;
};

const normalizeItemForOutput = (it = {}) => {
  const src = it?._doc ? { ...it._doc, ...it } : { ...(it || {}) };
  const obj = { ...src };
  const lt  = src.latestTrailer || src.latestTrailerSchema || null;

  obj.type      = src.type || src.trim || "normal";
  obj.movieName = src.movieName || src.title || "";
  obj.poster    = src.poster ? getUploadUrl(src.poster) : null;
  obj.thumbnail = lt?.thumbnail ? getUploadUrl(lt.thumbnail) : obj.poster;
  obj.trailerUrl = src.trailerUrl || (lt?.url || lt?.videoId) || null;

  if (obj.type === "latestTrailers" && lt) {
    obj.genres      = obj.genres      || lt.genres      || [];
    obj.year        = obj.year        || lt.year        || null;
    obj.rating      = obj.rating      || lt.rating      || null;
    obj.duration    = obj.duration    || lt.duration    || null;
    obj.description = obj.description || lt.description || lt.excerpt || "";
  }

  obj.cast      = (src.cast      || []).map(personToPreview);
  obj.directors = (src.directors || []).map(personToPreview);
  obj.producers = (src.producers || []).map(personToPreview);

  if (lt) obj.latestTrailer = enrichLatestTrailerForOutput(lt);
  obj.auditorium = src.auditorium || null;

  return obj;
};

/* ── createMovie ─────────────────────────────────────────── */
export const createMovie = async (req, res) => {
  try {
    const body = req.body || {};

    // ← FIXED: use .path for Cloudinary URL, fallback to .filename for local
    const getPosterUrl = (fileObj) => {
      if (!fileObj) return null;
      // Cloudinary gives full URL in .path
      if (fileObj.path && /^https?:\/\//.test(fileObj.path)) return fileObj.path;
      // Local multer gives filename
      if (fileObj.filename) return getUploadUrl(fileObj.filename);
      return null;
    };

    const posterUrl  = req.files?.poster?.[0]
      ? getPosterUrl(req.files.poster[0])
      : (body.poster || null);

    const trailerUrl = req.files?.trailerUrl?.[0]
      ? getPosterUrl(req.files.trailerUrl[0])
      : (body.trailerUrl || null);

    const videoUrl   = req.files?.videoUrl?.[0]
      ? getPosterUrl(req.files.videoUrl[0])
      : (body.videoUrl || null);

    const categories = safeParseJSON(body.categories) || (body.categories ? String(body.categories).split(",").map(s => s.trim()).filter(Boolean) : []);
    const slots      = safeParseJSON(body.slots) || [];
    const seatPrices = safeParseJSON(body.seatPrices) || { standard: Number(body.standard || 0), recliner: Number(body.recliner || 0) };
    const cast       = safeParseJSON(body.cast) || [];
    const directors  = safeParseJSON(body.directors) || [];
    const producers  = safeParseJSON(body.producers) || [];

    // ← FIXED: attachFiles uses .path for Cloudinary or .filename for local
    const attachFiles = (filesArrName, targetArr) => {
      if (!req.files?.[filesArrName]) return;
      req.files[filesArrName].forEach((file, idx) => {
        const url = (file.path && /^https?:\/\//.test(file.path)) ? file.path : getUploadUrl(file.filename);
        if (targetArr[idx]) {
          targetArr[idx].file = url;
          targetArr[idx].File = url;
        } else {
          targetArr[idx] = { name: "", file: url, File: url };
        }
      });
    };

    attachFiles("castFiles",     cast);
    attachFiles("directorFiles", directors);
    attachFiles("producerFiles", producers);

    // latest trailer
    const latestTrailerBody = safeParseJSON(body.latestTrailer) || {};
    if (req.files?.ltThumbnail?.[0]) {
      const f = req.files.ltThumbnail[0];
      latestTrailerBody.thumbnail = (f.path && /^https?:\/\//.test(f.path)) ? f.path : f.filename;
    } else if (body.ltThumbnail) {
      const fn = extractFilenameFromUrl(body.ltThumbnail);
      latestTrailerBody.thumbnail = fn ? fn : body.ltThumbnail;
    }

    if (body.ltVideoUrl) latestTrailerBody.videoId = body.ltVideoUrl;
    if (body.ltUrl)      latestTrailerBody.url     = body.ltUrl;
    if (body.ltTitle)    latestTrailerBody.title   = body.ltTitle;

    latestTrailerBody.directors = latestTrailerBody.directors || [];
    latestTrailerBody.producers = latestTrailerBody.producers || [];
    latestTrailerBody.singers   = latestTrailerBody.singers   || [];

    const attachLtFiles = (fieldName, arrName) => {
      if (!req.files?.[fieldName]) return;
      req.files[fieldName].forEach((file, idx) => {
        const url = (file.path && /^https?:\/\//.test(file.path)) ? file.path : file.filename;
        if (latestTrailerBody[arrName][idx]) latestTrailerBody[arrName][idx].file = url;
        else latestTrailerBody[arrName][idx] = { name: "", file: url };
      });
    };

    attachLtFiles("ltDirectorFiles", "directors");
    attachLtFiles("ltProducerFiles", "producers");
    attachLtFiles("ltSingerFiles",   "singers");

    latestTrailerBody.directors = buildLatestTrailerPeople(latestTrailerBody.directors);
    latestTrailerBody.producers = buildLatestTrailerPeople(latestTrailerBody.producers);
    latestTrailerBody.singers   = buildLatestTrailerPeople(latestTrailerBody.singers);

    const auditoriumValue = (typeof body.auditorium === "string" && body.auditorium.trim())
      ? String(body.auditorium).trim()
      : "Audi 1";

    const doc = new Movie({
      _id: new mongoose.Types.ObjectId(),
      type:     body.type || "normal",
      trim:     body.type || "normal",
      movieName: body.movieName || body.title || "",
      categories,
      poster:    posterUrl,
      trailerUrl,
      videoUrl,
      rating:   Number(body.rating)   || 0,
      duration: Number(body.duration) || 0,
      slots,
      seatPrices,
      cast,
      directors,
      producers,
      story:  body.story || "",
      latestTrailer:       latestTrailerBody,
      latestTrailerSchema: latestTrailerBody,
      auditorium: auditoriumValue,
    });

    console.log("✅ Saving movie with poster:", posterUrl);
    const saved = await doc.save();
    res.status(201).json({ success: true, message: "Movie created successfully", data: saved });

  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ── getMovies ───────────────────────────────────────────── */
export const getMovies = async (req, res) => {
  try {
    const { category, type, sort = '-createdAt', page = 1, limit = 12, search, latestTrailers } = req.query || {};
    let filter = {};
    if (typeof category === "string" && category.trim()) filter.categories = { $in: [category.trim()] };
    if (typeof type === "string" && type.trim()) {
      const t = type.trim();
      filter.$or = [{ type: t }, { trim: t }];
    }
    if (typeof search === "string" && search.trim()) {
      const q = search.trim();
      const searchOr = [
        { movieName: { $regex: q, $options: "i" } },
        { "latestTrailer.title": { $regex: q, $options: "i" } },
        { story: { $regex: q, $options: "i" } },
      ];
      if (filter.$or) filter = { $and: [{ $or: filter.$or }, { $or: searchOr }] };
      else filter.$or = searchOr;
    }
    if (latestTrailers && String(latestTrailers).toLowerCase() === "true") {
      const tf = { $or: [{ type: "latestTrailers" }, { trim: "latestTrailers" }] };
      filter = Object.keys(filter).length === 0 ? tf : { $and: [filter, tf] };
    }

    const pg   = Math.max(1, parseInt(page, 10)  || 1);
    const lim  = Math.min(200, parseInt(limit, 10) || 12);
    const skip = (pg - 1) * lim;

    const total = await Movie.countDocuments(filter);
    const items = await Movie.find(filter).sort(sort).skip(skip).limit(lim).lean();

    const normalized = (items || []).map(normalizeItemForOutput);
    res.status(200).json({ success: true, total, page: pg, limit: lim, data: normalized });

  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ── getMovieById ────────────────────────────────────────── */
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params || {};
    if (!id) return res.status(400).json({ success: false, message: "Required movie ID" });
    const item = await Movie.findById(id).lean();
    if (!item) return res.status(404).json({ success: false, message: "Movie not found" });
    const obj = normalizeItemForOutput(item);
    if (item.type === "latestTrailers" && item.latestTrailer) {
      const lt = item.latestTrailer;
      obj.genres      = obj.genres      || lt.genres      || [];
      obj.year        = obj.year        || lt.year        || null;
      obj.rating      = obj.rating      || lt.rating      || null;
      obj.duration    = obj.duration    || lt.duration    || null;
      obj.description = obj.description || lt.description || lt.excerpt || "";
    }
    res.status(200).json({ success: true, data: obj });
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ── deleteMovie ─────────────────────────────────────────── */
export async function deleteMovie(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: "ID is required." });
    const m = await Movie.findById(id);
    if (!m) return res.status(404).json({ success: false, message: "Movie not found" });

    // Only delete local files — skip Cloudinary URLs
    if (m.poster) tryUnlinkUploadUrl(m.poster);
    if (m.latestTrailer?.thumbnail) tryUnlinkUploadUrl(m.latestTrailer.thumbnail);
    [(m.cast || []), (m.directors || []), (m.producers || [])].forEach(arr =>
      arr.forEach(p => { if (p?.file) tryUnlinkUploadUrl(p.file); })
    );
    if (m.latestTrailer) {
      ([...(m.latestTrailer.directors || []), ...(m.latestTrailer.producers || []), ...(m.latestTrailer.singers || [])])
        .forEach(p => { if (p?.file) tryUnlinkUploadUrl(p.file); });
    }
    await Movie.findByIdAndDelete(id);
    return res.json({ success: true, message: "Movie Deleted." });
  } catch (error) {
    console.error("DeleteMovie Error", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
}

export default { createMovie, getMovies, getMovieById, deleteMovie };