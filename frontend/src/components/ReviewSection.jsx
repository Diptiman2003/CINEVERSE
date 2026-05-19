//Made by AI

// ReviewSection.jsx
// Place this file in: frontend/src/components/ReviewSection.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Trash2, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:5000";

// ─── Star Rating Component ──────────────────────────────────────────────────
const StarRating = ({ rating, setRating, readOnly = false, size = "text-2xl" }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          onClick={() => !readOnly && setRating && setRating(star)}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          className={`${size} transition-colors duration-150 ${
            readOnly ? "cursor-default" : "cursor-pointer"
          } ${
            star <= (hovered || rating)
              ? "text-yellow-400"
              : "text-gray-600"
          }`}
          aria-label={readOnly ? `${star} star` : `Rate ${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

// ─── Main ReviewSection Component ──────────────────────────────────────────
export default function ReviewSection({ movieId }) {
  const [reviews, setReviews]           = useState([]);
  const [avgRating, setAvgRating]       = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [rating, setRating]             = useState(0);
  const [reviewText, setReviewText]     = useState("");
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [userReviewed, setUserReviewed] = useState(false);
  const [isLoggedIn, setIsLoggedIn]     = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Check if user is logged in from localStorage (matches your auth pattern)
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user  = localStorage.getItem("user");
    if (token && user) {
      try {
        const parsed = JSON.parse(user);
        setIsLoggedIn(true);
        setCurrentUserId(parsed.id || parsed._id || null);
      } catch {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch reviews whenever movieId or login state changes
  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId, isLoggedIn, currentUserId]);

  const fetchReviews = async () => {
    setFetching(true);
    try {
      const res = await axios.get(`${API_BASE}/api/reviews/${movieId}`);
      if (res.data.success) {
        setReviews(res.data.reviews);
        setAvgRating(res.data.avgRating);
        setTotalReviews(res.data.totalReviews);

        // Check if current user already reviewed
        if (currentUserId) {
          const already = res.data.reviews.find(
            (r) =>
              r.userId?._id === currentUserId ||
              r.userId?.id  === currentUserId
          );
          setUserReviewed(!!already);
        }
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (reviewText.trim().length < 10) {
      toast.error("Review must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE}/api/reviews/${movieId}`,
        { rating, reviewText: reviewText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success("Review submitted! Thank you 🎉");
        setRating(0);
        setReviewText("");
        fetchReviews();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(
        `${API_BASE}/api/reviews/${movieId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Your review has been deleted");
        setUserReviewed(false);
        fetchReviews();
      }
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="mt-10 rounded-2xl p-6"
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        border: "1px solid rgba(220, 38, 38, 0.2)",
      }}
    >
      {/* ── Section Header ── */}
      <h2
        className="text-white text-2xl font-bold mb-6 flex items-center gap-3"
        style={{
          fontFamily: "'Cinzel', 'Times New Roman', serif",
          textShadow: "0 2px 10px rgba(220, 38, 38, 0.4)",
        }}
      >
        <MessageSquare className="text-red-500" size={24} />
        Ratings & Reviews
      </h2>

      {/* ── Average Rating Banner ── */}
      <div
        className="flex items-center gap-6 mb-6 p-4 rounded-xl"
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <div className="text-center">
          <div className="text-5xl font-bold text-yellow-400">{avgRating}</div>
          <div className="text-gray-400 text-xs mt-1">out of 5</div>
        </div>
        <div>
          <StarRating rating={Math.round(avgRating)} readOnly size="text-3xl" />
          <p className="text-gray-400 text-sm mt-2">
            Based on{" "}
            <span className="text-white font-semibold">{totalReviews}</span>{" "}
            {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* ── Write Review Form (logged in, not yet reviewed) ── */}
      {isLoggedIn && !userReviewed && (
        <div
          className="mb-6 p-5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(220,38,38,0.15)" }}
        >
          <h3 className="text-white font-semibold mb-3 text-lg">
            Write Your Review
          </h3>

          <div className="mb-3">
            <p className="text-gray-400 text-sm mb-1">Your Rating</p>
            <StarRating rating={rating} setRating={setRating} size="text-3xl" />
          </div>

          <textarea
            className="w-full mt-2 rounded-xl p-3 text-sm text-white resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)" }}
            rows={4}
            placeholder="Share your thoughts about this movie... (minimum 10 characters)"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-1 mb-3">
            <span className="text-gray-500 text-xs">
              {reviewText.length}/500 characters
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50"
            style={{
              background: loading
                ? "rgba(220,38,38,0.5)"
                : "linear-gradient(135deg, #dc2626, #b91c1c)",
              boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
            }}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      )}

      {/* ── Already Reviewed Banner ── */}
      {isLoggedIn && userReviewed && (
        <div
          className="mb-6 p-4 rounded-xl flex justify-between items-center"
          style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)" }}
        >
          <p className="text-green-400 font-medium">
            ✅ You have already reviewed this movie
          </p>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      {/* ── Not Logged In Message ── */}
      {!isLoggedIn && (
        <div
          className="mb-6 p-4 rounded-xl text-center"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-gray-400 text-sm">
            Please{" "}
            <a href="/login" className="text-red-400 underline hover:text-red-300">
              login
            </a>{" "}
            to write a review
          </p>
        </div>
      )}

      {/* ── Reviews List ── */}
      <h3 className="text-white font-semibold mb-3 text-lg">
        All Reviews{" "}
        <span className="text-gray-400 text-base font-normal">
          ({totalReviews})
        </span>
      </h3>

      {fetching ? (
        <div className="text-center py-6">
          <p className="text-gray-500 text-sm">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div
          className="text-center py-8 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)" }}
        >
          <Star className="text-gray-600 mx-auto mb-2" size={32} />
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="p-4 rounded-xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                {/* User name */}
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #dc2626, #7c3aed)" }}
                  >
                    {(r.userId?.fullName || r.userId?.userName || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">
                      {r.userId?.fullName || r.userId?.userName || "User"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatDate(r.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Star rating */}
                <StarRating rating={r.rating} readOnly size="text-base" />
              </div>

              {/* Review text */}
              <p className="text-gray-300 text-sm leading-relaxed mt-2">
                {r.reviewText}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
