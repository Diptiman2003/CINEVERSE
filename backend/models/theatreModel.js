import mongoose from "mongoose";

const theatreSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String,

    location: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    facilities: [String],
    screens: [String],
    totalScreens: Number,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ⭐ IMPORTANT INDEX FOR NEAREST SEARCH
theatreSchema.index({ location: "2dsphere" });

export default mongoose.model("Theatre", theatreSchema);