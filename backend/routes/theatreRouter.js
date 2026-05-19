// //made by ai
// // theatreModel.js
// // Place in: backend/models/theatreModel.js

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
// theatreRouter.js
// Place in: backend/routes/theatreRouter.js

// import express from "express";
// import Theatre from "../models/theatreModel.js";

// const theatreRouter = express.Router();

// // ── GET all theatres ────────────────────────────────────────
// // GET /api/theatres
// theatreRouter.get("/", async (req, res) => {
//   try {
//     const theatres = await Theatre.find({ isActive: true });
//     return res.status(200).json({ success: true, theatres });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // ── GET theatres by city name ───────────────────────────────
// // GET /api/theatres/city/Chennai
// theatreRouter.get("/city/:city", async (req, res) => {
//   try {
//     const city = req.params.city;

//     const theatres = await Theatre.find({
//       city: { $regex: new RegExp(city, "i") }, // case insensitive
//       isActive: true,
//     });

//     return res.status(200).json({
//       success: true,
//       theatres,
//       total: theatres.length,
//       city,
//     });
//   } catch (error) {
//     console.error("Error fetching theatres by city:", error);
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // ── GET nearest theatres by coordinates ─────────────────────
// // GET /api/theatres/nearest?lat=12.97&lng=80.22&radius=20
// theatreRouter.get("/nearest", async (req, res) => {
//   try {
//     const { lat, lng, radius = 20 } = req.query;

//     if (!lat || !lng) {
//       return res.status(400).json({
//         success: false,
//         message: "lat and lng are required",
//       });
//     }

//     const userLat = parseFloat(lat);
//     const userLng = parseFloat(lng);

//     function getDistanceKm(lat1, lng1, lat2, lng2) {
//       const R = 6371;
//       const dLat = ((lat2 - lat1) * Math.PI) / 180;
//       const dLng = ((lng2 - lng1) * Math.PI) / 180;
//       const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos((lat1 * Math.PI) / 180) *
//           Math.cos((lat2 * Math.PI) / 180) *
//           Math.sin(dLng / 2) *
//           Math.sin(dLng / 2);
//       return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     }

//     const allTheatres = await Theatre.find({ isActive: true });

//     const theatresWithDistance = allTheatres
//       .map((t) => ({
//         ...t.toObject(),
//         distanceKm: parseFloat(
//           getDistanceKm(userLat, userLng, t.location.lat, t.location.lng).toFixed(1)
//         ),
//       }))
//       .filter((t) => t.distanceKm <= parseFloat(radius))
//       .sort((a, b) => a.distanceKm - b.distanceKm);

//     return res.status(200).json({
//       success: true,
//       theatres: theatresWithDistance,
//       total: theatresWithDistance.length,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// // ── POST add theatre ────────────────────────────────────────
// // POST /api/theatres
// theatreRouter.post("/", async (req, res) => {
//   try {
//     const { name, address, city, state, pincode, phone, location, facilities, screens, totalScreens } = req.body;

//     if (!name || !address || !city) {
//       return res.status(400).json({
//         success: false,
//         message: "name, address and city are required",
//       });
//     }

//     const newTheatre = await Theatre.create({
//       name, address, city,
//       state:        state        || "",
//       pincode:      pincode      || "",
//       phone:        phone        || "",
//       location:     location     || { lat: 0, lng: 0 },
//       facilities:   facilities   || ["Parking", "Food Court"],
//       screens:      screens      || ["Standard"],
//       totalScreens: totalScreens || 1,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Theatre added!",
//       theatre: newTheatre,
//     });
//   } catch (error) {
//     return res.status(500).json({ success: false, message: "Server Error" });
//   }
// });

// export default theatreRouter;


// seedTheatres.js
// Place in: backend/seedTheatres.js

// import mongoose from "mongoose";
// // import Theatre from "./models/theatreModel.js";
// import Theatre from "../models/theatreModel.js"

// // ── Your exact MongoDB URI from db.js ──────────────────────
// const MONGO_URI = "mongodb+srv://sarcardiptiman03_db_user:Moviebook123@cluster0.vbqujpn.mongodb.net/MovieBookSystem";

// const sampleTheatres = [
//   // Chennai
//   {
//     name: "PVR Cinemas - Phoenix MarketCity",
//     address: "Velachery Main Rd, Velachery",
//     city: "Chennai", state: "Tamil Nadu", pincode: "600042",
//     phone: "044-48931717",
//     location: { lat: 12.9783, lng: 80.2209 },
//     facilities: ["Parking", "Food Court", "Wheelchair Access", "Online Booking"],
//     screens: ["Standard", "Recliner", "IMAX"],
//     totalScreens: 8,
//   },
//   {
//     name: "INOX - Sathyam Cinemas",
//     address: "8, Thiru Vi Ka Rd, Royapettah",
//     city: "Chennai", state: "Tamil Nadu", pincode: "600014",
//     phone: "044-28463636",
//     location: { lat: 13.0569, lng: 80.2664 },
//     facilities: ["Parking", "Food Court", "Dolby Atmos"],
//     screens: ["Standard", "Recliner"],
//     totalScreens: 6,
//   },
//   {
//     name: "Rohini Silver Screens",
//     address: "3, Thirumangalam Rd, Anna Nagar",
//     city: "Chennai", state: "Tamil Nadu", pincode: "600040",
//     phone: "044-26281919",
//     location: { lat: 13.0850, lng: 80.2101 },
//     facilities: ["Parking", "Food Court"],
//     screens: ["Standard"],
//     totalScreens: 3,
//   },
//   {
//     name: "Cinepolis - VR Chennai",
//     address: "Anna Salai, Nandanam",
//     city: "Chennai", state: "Tamil Nadu", pincode: "600035",
//     phone: "044-49494949",
//     location: { lat: 13.0227, lng: 80.2489 },
//     facilities: ["Parking", "Food Court", "4DX"],
//     screens: ["Standard", "Recliner", "4DX"],
//     totalScreens: 7,
//   },
//   // Bangalore
//   {
//     name: "PVR - Orion Mall",
//     address: "Hand Post, Malleshwaram West",
//     city: "Bangalore", state: "Karnataka", pincode: "560055",
//     phone: "080-49494949",
//     location: { lat: 12.9975, lng: 77.5553 },
//     facilities: ["Parking", "Food Court", "IMAX"],
//     screens: ["Standard", "Recliner", "IMAX"],
//     totalScreens: 9,
//   },
//   {
//     name: "INOX - Garuda Mall",
//     address: "Magrath Rd, Ashok Nagar",
//     city: "Bangalore", state: "Karnataka", pincode: "560025",
//     phone: "080-22118080",
//     location: { lat: 12.9721, lng: 77.6097 },
//     facilities: ["Parking", "Food Court", "Dolby Atmos"],
//     screens: ["Standard", "Recliner"],
//     totalScreens: 6,
//   },
//   // Mumbai
//   {
//     name: "PVR - Juhu",
//     address: "Juhu Tara Rd, Juhu",
//     city: "Mumbai", state: "Maharashtra", pincode: "400049",
//     phone: "022-26701717",
//     location: { lat: 19.0969, lng: 72.8267 },
//     facilities: ["Parking", "Food Court"],
//     screens: ["Standard", "Recliner"],
//     totalScreens: 5,
//   },
//   {
//     name: "Cinepolis - Andheri",
//     address: "Infinity Mall, New Link Rd, Andheri West",
//     city: "Mumbai", state: "Maharashtra", pincode: "400053",
//     phone: "022-66759999",
//     location: { lat: 19.1367, lng: 72.8296 },
//     facilities: ["Parking", "Food Court", "4DX"],
//     screens: ["Standard", "Recliner", "4DX"],
//     totalScreens: 8,
//   },
//   // Delhi
//   {
//     name: "PVR - Select Citywalk",
//     address: "A-3, District Centre, Saket",
//     city: "Delhi", state: "Delhi", pincode: "110017",
//     phone: "011-41674167",
//     location: { lat: 28.5273, lng: 77.2190 },
//     facilities: ["Parking", "Food Court", "IMAX", "Dolby Atmos"],
//     screens: ["Standard", "Recliner", "IMAX"],
//     totalScreens: 11,
//   },
//   {
//     name: "INOX - Nehru Place",
//     address: "Anupam Complex, Nehru Place",
//     city: "Delhi", state: "Delhi", pincode: "110019",
//     phone: "011-26464444",
//     location: { lat: 28.5494, lng: 77.2515 },
//     facilities: ["Parking", "Food Court"],
//     screens: ["Standard"],
//     totalScreens: 4,
//   },
//   // Bhubaneswar
//   {
//     name: "Cinepolis - Esplanade One",
//     address: "Rasulgarh, Esplanade One Mall",
//     city: "Bhubaneswar", state: "Odisha", pincode: "751010",
//     phone: "0674-4949494",
//     location: { lat: 20.2961, lng: 85.8245 },
//     facilities: ["Parking", "Food Court", "Dolby Atmos"],
//     screens: ["Standard", "Recliner"],
//     totalScreens: 6,
//   },
//   {
//     name: "PVR - Forum Mart",
//     address: "Saheed Nagar, Forum Mart Mall",
//     city: "Bhubaneswar", state: "Odisha", pincode: "751007",
//     phone: "0674-3434343",
//     location: { lat: 20.2847, lng: 85.8402 },
//     facilities: ["Parking", "Food Court"],
//     screens: ["Standard", "Recliner"],
//     totalScreens: 4,
//   },
//   // Hyderabad
//   {
//     name: "PVR - Inorbit Mall",
//     address: "Inorbit Mall, Cyberabad",
//     city: "Hyderabad", state: "Telangana", pincode: "500081",
//     phone: "040-49494949",
//     location: { lat: 17.4375, lng: 78.3892 },
//     facilities: ["Parking", "Food Court", "IMAX"],
//     screens: ["Standard", "Recliner", "IMAX"],
//     totalScreens: 10,
//   },
//   {
//     name: "AMB Cinemas",
//     address: "Gachibowli, Financial District",
//     city: "Hyderabad", state: "Telangana", pincode: "500032",
//     phone: "040-23232323",
//     location: { lat: 17.4239, lng: 78.3611 },
//     facilities: ["Parking", "Food Court", "4DX", "Luxury Recliners"],
//     screens: ["Standard", "Recliner", "4DX"],
//     totalScreens: 8,
//   },
// ];

// async function seedTheatres() {
//   try {
//     console.log("🔗 Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB!");

//     // Clear existing theatres
//     await Theatre.deleteMany({});
//     console.log("🗑️  Cleared old theatres");

//     // Insert new theatres
//     await Theatre.insertMany(sampleTheatres);
//     console.log(`✅ Added ${sampleTheatres.length} theatres successfully!`);

//     console.log("\n🎬 Cities added:");
//     const cities = [...new Set(sampleTheatres.map(t => t.city))];
//     cities.forEach(c => {
//       const count = sampleTheatres.filter(t => t.city === c).length;
//       console.log(`   📍 ${c} — ${count} theatre(s)`);
//     });

//     console.log("\n✨ Seeding complete! Restart your backend now.");
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Seeding failed:", error.message);
//     process.exit(1);
//   }
// }

// seedTheatres();

//made by chatgpt
//theatreRouter.js
import express from "express";
import Theatre from "../models/theatreModel.js";

const router = express.Router();

// GET NEARBY THEATRES
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    // const theatres = await Theatre.find({
    //   location: {
    //     $near: {
    //       $geometry: {
    //         type: "Point",
    //         coordinates: [parseFloat(lng), parseFloat(lat)],
    //       },
    //       $maxDistance: 10000,
    //     },
    //   },
    // });
        const theatres = await Theatre.find(); // ✅ TEMP FIX (IMPORTANT)

    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/all", async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

