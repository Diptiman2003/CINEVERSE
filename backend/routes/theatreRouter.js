import express from "express";
import Theatre from "../models/theatreModel.js";

const router = express.Router();

// GET NEARBY THEATRES
router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng } = req.query;

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

