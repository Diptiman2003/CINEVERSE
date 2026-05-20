// FestivalBanner.jsx
// Place in: admin/src/components/FestivalBanner.jsx (user-facing app equivalent path)
// This is a reusable banner slider that fetches active festival banners from the API.

import React, { useEffect, useState, useRef } from "react";

const API_HOST = "http://localhost:5000";

// ── Single Banner Card ────────────────────────────────────────────────
const BannerCard = ({ banner }) => {
  const {
    title, subtitle, description,
    discountLabel, couponCode,
    bannerImage,
    bgColor = "#1a1a2e",
    accentColor = "#e50914",
    textColor = "#ffffff",
  } = banner;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "220px",
        borderRadius: "16px",
        overflow: "hidden",
        background: bannerImage
          ? `linear-gradient(to right, ${bgColor}ee, ${bgColor}88), url(${bannerImage}) center/cover no-repeat`
          : `linear-gradient(135deg, ${bgColor}, ${bgColor}cc)`,
        color: textColor,
        display: "flex",
        alignItems: "center",
        padding: "32px 40px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        userSelect: "none",
      }}
    >
      {/* Decorative circles */}
      <div style={{
        position:"absolute", right:"-40px", top:"-40px",
        width:"200px", height:"200px", borderRadius:"50%",
        background:`${accentColor}22`, pointerEvents:"none"
      }}/>
      <div style={{
        position:"absolute", right:"60px", bottom:"-60px",
        width:"150px", height:"150px", borderRadius:"50%",
        background:`${accentColor}15`, pointerEvents:"none"
      }}/>

      {/* Content */}
      <div style={{ position:"relative", zIndex:1, flex:1 }}>
        {/* Discount label badge */}
        {discountLabel && (
          <div style={{
            display:"inline-block",
            background: accentColor,
            color:"#fff",
            fontWeight: 800,
            fontSize:"13px",
            padding:"4px 14px",
            borderRadius:"20px",
            letterSpacing:"0.5px",
            marginBottom:"12px",
            textTransform:"uppercase",
          }}>
            🎉 {discountLabel}
          </div>
        )}

        {/* Title */}
        <h2 style={{
          margin:"0 0 6px",
          fontSize:"clamp(22px, 4vw, 34px)",
          fontWeight:800,
          lineHeight:1.2,
          textShadow:"0 2px 8px rgba(0,0,0,0.5)",
        }}>
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p style={{
            margin:"0 0 10px",
            fontSize:"clamp(13px, 2.5vw, 17px)",
            opacity:0.9,
            fontWeight:500,
          }}>
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p style={{
            margin:"0 0 14px",
            fontSize:"13px",
            opacity:0.75,
            maxWidth:"480px",
          }}>
            {description}
          </p>
        )}

        {/* Coupon code */}
        {couponCode && (
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap" }}>
            <span style={{ fontSize:"13px", opacity:0.85 }}>Use code:</span>
            <span style={{
              background:"rgba(255,255,255,0.15)",
              border:`1.5px dashed ${accentColor}`,
              borderRadius:"8px",
              padding:"4px 14px",
              fontWeight:700,
              fontSize:"15px",
              letterSpacing:"2px",
              fontFamily:"monospace",
              backdropFilter:"blur(4px)",
            }}>
              {couponCode}
            </span>
            <CopyBtn text={couponCode} accentColor={accentColor}/>
          </div>
        )}
      </div>
    </div>
  );
};

// ── Small copy-to-clipboard button ────────────────────────────────────
const CopyBtn = ({ text, accentColor }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={copy}
      style={{
        background: copied ? "#28a745" : accentColor,
        color:"#fff",
        border:"none",
        borderRadius:"6px",
        padding:"4px 12px",
        fontSize:"12px",
        fontWeight:600,
        cursor:"pointer",
        transition:"background 0.2s",
      }}
    >
      {copied ? "✓ Copied!" : "Copy"}
    </button>
  );
};

// ── Dot indicators ────────────────────────────────────────────────────
const Dots = ({ count, current, onDotClick }) => (
  <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"14px" }}>
    {Array.from({ length: count }).map((_, i) => (
      <button
        key={i}
        onClick={() => onDotClick(i)}
        style={{
          width: i === current ? "24px" : "8px",
          height:"8px",
          borderRadius:"4px",
          background: i === current ? "#e50914" : "rgba(255,255,255,0.35)",
          border:"none",
          padding:0,
          cursor:"pointer",
          transition:"all 0.3s",
        }}
      />
    ))}
  </div>
);

// ── Main FestivalBanner component ─────────────────────────────────────
const FestivalBanner = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    fetch(`${API_HOST}/api/banners/active`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) setBanners(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Auto-slide every 5 s
  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [banners.length]);

  const goTo = (idx) => {
    clearInterval(timerRef.current);
    setCurrent(idx);
  };

  if (loading) return null;           // silent load
  if (banners.length === 0) return null; // no active banners → nothing shown

  return (
    <div style={{ margin:"0 0 28px", position:"relative" }}>
      {/* Prev / Next arrows (only when >1 banner) */}
      {banners.length > 1 && (
        <>
          <ArrowBtn dir="left"  onClick={() => goTo((current - 1 + banners.length) % banners.length)} />
          <ArrowBtn dir="right" onClick={() => goTo((current + 1) % banners.length)} />
        </>
      )}

      {/* Slide */}
      <div style={{ transition:"opacity 0.4s", opacity:1 }}>
        <BannerCard banner={banners[current]} />
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <Dots count={banners.length} current={current} onDotClick={goTo} />
      )}
    </div>
  );
};

// ── Arrow buttons ─────────────────────────────────────────────────────
const ArrowBtn = ({ dir, onClick }) => (
  <button
    onClick={onClick}
    style={{
      position:"absolute",
      top:"50%",
      [dir === "left" ? "left" : "right"]: "12px",
      transform:"translateY(-50%)",
      zIndex:10,
      background:"rgba(0,0,0,0.45)",
      color:"#fff",
      border:"none",
      borderRadius:"50%",
      width:"36px",
      height:"36px",
      fontSize:"18px",
      cursor:"pointer",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      backdropFilter:"blur(4px)",
    }}
  >
    {dir === "left" ? "‹" : "›"}
  </button>
);

export default FestivalBanner;