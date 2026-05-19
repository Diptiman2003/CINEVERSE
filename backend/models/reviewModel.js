//made by using cloudai
//reviewModel.js
import mongoose from "mongoose";
 
const reviewSchema = new mongoose.Schema({
 
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
 
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
 
  reviewText: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
    trim: true,
  },
 
}, { timestamps: true });
 
// One review per user per movie only
reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });
 
const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
 
export default Review;