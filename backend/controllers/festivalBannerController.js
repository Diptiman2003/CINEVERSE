// festivalBannerController.js
// Place in: backend/controllers/festivalBannerController.js
import FestivalBanner from "../models/festivalBannerModel.js";
import { v2 as cloudinary } from "cloudinary";

/* ─────────────────────────────────────────────────────────────
   ADMIN: Create a new festival banner
   POST /api/banners
───────────────────────────────────────────────────────────── */
export const createBanner = async (req, res) => {
  try {
    const {
      title, subtitle, description,
      discountLabel, couponCode,
      bgColor, accentColor, textColor,
      startDate, endDate,
      isActive, priority,
    } = req.body;

    if (!title)     return res.status(400).json({ success: false, message: "Banner title is required." });
    if (!startDate) return res.status(400).json({ success: false, message: "startDate is required." });
    if (!endDate)   return res.status(400).json({ success: false, message: "endDate is required." });

    // Handle optional banner image upload (via Cloudinary multer middleware)
    let bannerImage = req.body.bannerImage || "";
    if (req.file?.path) bannerImage = req.file.path; // Cloudinary URL

    const banner = new FestivalBanner({
      title,
      subtitle:      subtitle      || "",
      description:   description   || "",
      discountLabel: discountLabel || "",
      couponCode:    couponCode    || "",
      bannerImage,
      bgColor:       bgColor      || "#1a1a2e",
      accentColor:   accentColor  || "#e50914",
      textColor:     textColor    || "#ffffff",
      startDate:     new Date(startDate),
      endDate:       new Date(endDate),
      isActive:      isActive !== undefined ? Boolean(isActive) : true,
      priority:      Number(priority) || 0,
    });

    const saved = await banner.save();
    res.status(201).json({ success: true, message: "Banner created successfully", data: saved });

  } catch (err) {
    console.error("createBanner error:", err);
    res.status(500).json({ success: false, message: "Server error while creating banner." });
  }
};

/* ─────────────────────────────────────────────────────────────
   ADMIN: Get ALL banners (with filters for admin dashboard)
   GET /api/banners/admin
───────────────────────────────────────────────────────────── */
export const getAllBanners = async (req, res) => {
  try {
    const banners = await FestivalBanner.find({}).sort({ priority: -1, createdAt: -1 });
    res.json({ success: true, data: banners });
  } catch (err) {
    console.error("getAllBanners error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ─────────────────────────────────────────────────────────────
   PUBLIC: Get ACTIVE banners for the home page
   Returns banners where isActive=true AND today is within startDate–endDate
   GET /api/banners/active
───────────────────────────────────────────────────────────── */
export const getActiveBanners = async (req, res) => {
  try {
    const now = new Date();
    const banners = await FestivalBanner.find({
      isActive:  true,
      startDate: { $lte: now },
      endDate:   { $gte: now },
    }).sort({ priority: -1, createdAt: -1 });

    res.json({ success: true, data: banners });
  } catch (err) {
    console.error("getActiveBanners error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ─────────────────────────────────────────────────────────────
   ADMIN: Update a banner
   PUT /api/banners/:id
───────────────────────────────────────────────────────────── */
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file?.path) updates.bannerImage = req.file.path;
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate)   updates.endDate   = new Date(updates.endDate);
    if (updates.isActive !== undefined) updates.isActive = Boolean(updates.isActive);
    if (updates.priority !== undefined) updates.priority = Number(updates.priority);

    const updated = await FestivalBanner.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ success: false, message: "Banner not found." });

    res.json({ success: true, message: "Banner updated.", data: updated });
  } catch (err) {
    console.error("updateBanner error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ─────────────────────────────────────────────────────────────
   ADMIN: Toggle isActive (quick on/off switch)
   PATCH /api/banners/:id/toggle
───────────────────────────────────────────────────────────── */
export const toggleBanner = async (req, res) => {
  try {
    const banner = await FestivalBanner.findById(req.params.id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found." });

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({ success: true, message: `Banner is now ${banner.isActive ? "active" : "inactive"}.`, data: banner });
  } catch (err) {
    console.error("toggleBanner error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

/* ─────────────────────────────────────────────────────────────
   ADMIN: Delete a banner
   DELETE /api/banners/:id
───────────────────────────────────────────────────────────── */
export const deleteBanner = async (req, res) => {
  try {
    const deleted = await FestivalBanner.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Banner not found." });

    // Also remove from Cloudinary if it's a cloudinary URL
    if (deleted.bannerImage && deleted.bannerImage.includes("cloudinary")) {
      const publicId = deleted.bannerImage.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(`cineverse/banners/${publicId}`).catch(() => {});
    }

    res.json({ success: true, message: "Banner deleted." });
  } catch (err) {
    console.error("deleteBanner error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};