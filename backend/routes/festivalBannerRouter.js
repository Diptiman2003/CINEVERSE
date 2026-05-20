// festivalBannerRouter.js
// Place in: backend/routes/festivalBannerRouter.js
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {
  createBanner,
  getAllBanners,
  getActiveBanners,
  updateBanner,
  toggleBanner,
  deleteBanner,
} from "../controllers/festivalBannerController.js";

const bannerRouter = express.Router();

// ── Cloudinary storage for banner images ───────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "cineverse/banners",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation:  [{ width: 1400, height: 500, crop: "limit", quality: "auto" }],
  },
});

const upload = multer({ storage }).single("bannerImage");

// ── PUBLIC route ─────────────────────────────────────────────
// Users see only currently-active banners
bannerRouter.get("/active", getActiveBanners);

// ── ADMIN routes ─────────────────────────────────────────────
bannerRouter.get("/admin",        getAllBanners);
bannerRouter.post("/",            upload, createBanner);
bannerRouter.put("/:id",          upload, updateBanner);
bannerRouter.patch("/:id/toggle", toggleBanner);
bannerRouter.delete("/:id",       deleteBanner);

export default bannerRouter;