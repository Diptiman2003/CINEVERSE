// //this page is made by ai
// // theatreModel.js


// import mongoose from "mongoose";

// const theatreSchema = new mongoose.Schema({

//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   address: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   city: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   state: {
//     type: String,
//     trim: true,
//     default: "",
//   },

//   pincode: {
//     type: String,
//     trim: true,
//     default: "",
//   },

//   phone: {
//     type: String,
//     trim: true,
//     default: "",
//   },

//   // GPS coordinates for distance calculation
//   location: {
//     lat: { type: Number, required: true },
//     lng: { type: Number, required: true },
//   },

//   // Facilities
//   facilities: {
//     type: [String],
//     default: ["Parking", "Food Court"],
//   },

//   // Screen types available
//   screens: {
//     type: [String],
//     default: ["Standard", "Recliner"],
//   },

//   totalScreens: {
//     type: Number,
//     default: 1,
//   },

//   isActive: {
//     type: Boolean,
//     default: true,
//   },

// }, { timestamps: true });

// const Theatre = mongoose.models.Theatre || mongoose.model("Theatre", theatreSchema);

// export default Theatre;

//made by chatgpt
//theatreModel.js
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