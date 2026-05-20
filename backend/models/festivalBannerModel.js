// festivalBannerModel.js
// Place in: backend/models/festivalBannerModel.js
import mongoose from "mongoose";

const festivalBannerSchema = new mongoose.Schema({

  // Banner identity
  title:       { type: String, trim: true, required: true }, // e.g. "Diwali Dhamaka 🪔"
  subtitle:    { type: String, trim: true, default: "" },     // e.g. "Celebrate with upto 40% OFF!"
  description: { type: String, trim: true, default: "" },     // Optional body text

  // Discount info shown on banner
  discountLabel: { type: String, trim: true, default: "" },   // e.g. "UPTO 40% OFF", "FLAT ₹100 OFF"
  couponCode:    { type: String, trim: true, default: "" },   // e.g. "DIWALI40" (optional)

  // Visual
  bannerImage:    { type: String, trim: true, default: "" },  // Cloudinary URL or local path
  bgColor:        { type: String, trim: true, default: "#1a1a2e" }, // Fallback gradient/color
  accentColor:    { type: String, trim: true, default: "#e50914" }, // For badge/label
  textColor:      { type: String, trim: true, default: "#ffffff" },

  // Scheduling – admin sets active date range
  startDate: { type: Date, required: true },
  endDate:   { type: Date, required: true },

  // Toggle to instantly show/hide without deleting
  isActive: { type: Boolean, default: true },

  // Priority – higher number shows first when multiple banners are active
  priority: { type: Number, default: 0 },

}, { timestamps: true });

// Index for fast "give me active banners right now" queries
festivalBannerSchema.index({ isActive: 1, startDate: 1, endDate: 1 });

const FestivalBanner = mongoose.models.FestivalBanner || mongoose.model("FestivalBanner", festivalBannerSchema);

export default FestivalBanner;