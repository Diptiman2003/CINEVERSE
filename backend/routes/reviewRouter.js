import express from "express";
import Review from "../models/reviewModel.js";
import authMiddleware from "../middlewares/auth.js";
 
const reviewRouter = express.Router();
 
reviewRouter.get("/:movieId", async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.movieId })
      .populate("userId", "fullName userName")
      .sort({ createdAt: -1 });
 
    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          ).toFixed(1)
        : 0;
 
    return res.status(200).json({
      success: true,
      reviews,
      avgRating: Number(avgRating),
      totalReviews: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});
 
// ─── POST add a review (login required) ────────────────────────────────────
// POST /api/reviews/:movieId
reviewRouter.post("/:movieId", authMiddleware, async (req, res) => {
  try {
    const { rating, reviewText } = req.body || {};
    const movieId = req.params.movieId;
    const userId = req.user._id;
 
    // Validate inputs
    if (!rating || !reviewText) {
      return res.status(400).json({
        success: false,
        message: "Rating and review text are required",
      });
    }
 
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }
 
    if (reviewText.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: "Review must be at least 10 characters",
      });
    }
 
    // Check if user already reviewed this movie
    const existing = await Review.findOne({ movieId, userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this movie",
      });
    }
 
    const newReview = await Review.create({
      movieId,
      userId,
      rating: Number(rating),
      reviewText: reviewText.trim(),
    });
 
    // Populate user info before returning
    await newReview.populate("userId", "fullName userName");
 
    return res.status(201).json({
      success: true,
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this movie",
      });
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});
 
// ─── DELETE user's own review ───────────────────────────────────────────────
// DELETE /api/reviews/:movieId
reviewRouter.delete("/:movieId", authMiddleware, async (req, res) => {
  try {
    const deleted = await Review.findOneAndDelete({
      movieId: req.params.movieId,
      userId: req.user._id,
    });
 
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }
 
    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});
 
export default reviewRouter;