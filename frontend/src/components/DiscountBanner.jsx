// DiscountBanner.jsx  — Drop-in festival/discount banner for Home page
// Usage: place <DiscountBanner /> just below <Banner /> in Home.jsx
// The component fetches the latest active discount banner from the backend.
// Admin controls it via the AddPage "Discount Banner" section.

import React, { useEffect, useState } from "react";
import { Tag, X, Clock } from "lucide-react";

const API_BASE = "http://localhost:5000";

// Helper — turns seconds into HH:MM:SS
function useCountdown(expiresAt) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!expiresAt) return;
    const end = new Date(expiresAt).getTime();
    const tick = () => {
      const diff = end - Date.now();
      if (diff <= 0) { setTimeLeft(null); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setTimeLeft(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return timeLeft;
}

export default function DiscountBanner() {
  const [banner, setBanner]     = useState(null);
  const [closed, setClosed]     = useState(false);
  const [loading, setLoading]   = useState(true);

  const timeLeft = useCountdown(banner?.expiresAt);

  useEffect(() => {
    // Fetch movies and pick the first one that has an enabled discountBanner
    const load = async () => {
      try {
        const res  = await fetch(`${API_BASE}/api/movies?limit=50`);
        const data = await res.json();
        const movies = data.data || data.items || data.movies || [];
        const active = movies.find(
          (m) => m.discountBanner?.enabled === true &&
                 (!m.discountBanner.expiresAt || new Date(m.discountBanner.expiresAt) > new Date())
        );
        if (active) setBanner(active.discountBanner);
      } catch (_) {
        // silently fail — banner is optional UI
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Don't render if: loading, no active banner, or user dismissed
  if (loading || !banner || !banner.enabled || closed) return null;

  // After countdown hits 0 hide automatically
  if (banner.expiresAt && !timeLeft) return null;

  const bg   = banner.bgColor   || "#FF6B00";
  const text = banner.textColor || "#FFFFFF";

  return (
    <div
      style={{ backgroundColor: bg, color: text }}
      className="relative w-full z-40 overflow-hidden"
    >
      {/* Animated shimmer bar */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
          animation: "shimmer 2.4s infinite",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        {/* Left — badge + content */}
        <div className="flex items-center gap-3 flex-wrap">
          {banner.badgeText && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full tracking-widest uppercase"
              style={{
                backgroundColor: text,
                color: bg,
                opacity: 0.95,
              }}
            >
              {banner.badgeText}
            </span>
          )}

          <Tag size={16} className="shrink-0" style={{ color: text }} />

          <span className="font-bold text-sm md:text-base leading-tight">
            {banner.title}
          </span>

          {banner.subtitle && (
            <span className="text-sm opacity-90 leading-tight">
              — {banner.subtitle}
            </span>
          )}
        </div>

        {/* Right — countdown + close */}
        <div className="flex items-center gap-3">
          {timeLeft && (
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
              <Clock size={14} />
              <span>Ends in {timeLeft}</span>
            </div>
          )}
          <button
            onClick={() => setClosed(true)}
            aria-label="Dismiss banner"
            className="rounded-full p-0.5 transition-opacity hover:opacity-70"
            style={{ color: text }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}