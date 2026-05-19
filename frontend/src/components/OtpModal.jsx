// OtpModal.jsx
// Place in: frontend/src/components/OtpModal.jsx

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, Mail, RefreshCw } from "lucide-react";

const API_BASE = "http://localhost:5000/api/auth";

export default function OtpModal({ email, onSuccess, onClose }) {
  const [otp, setOtp]           = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer]       = useState(300); // 5 minutes
  const [error, setError]       = useState("");
  const inputRefs               = useRef([]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Handle OTP input
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only 1 digit per box
    setOtp(newOtp);
    setError("");

    // Auto move to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit when all 6 digits entered
    if (newOtp.every((d) => d !== "") && value) {
      handleVerify(newOtp.join(""));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      handleVerify(pasted);
    }
  };

  // Verify OTP
  const handleVerify = async (otpValue) => {
    const code = otpValue || otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_BASE}/verify-otp`, {
        email: email,
        otp:   code,
      });

      if (res.data.success) {
        toast.success("✅ OTP Verified! Logging you in...");
        onSuccess(res.data);
      } else {
        setError(res.data.message || "Invalid OTP");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Verification failed";
      setError(msg);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/send-otp`, { email });
      if (res.data.success) {
        toast.success("New OTP sent to your email!");
        setTimer(300);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      toast.error("Failed to resend OTP. Try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        background:      "rgba(0,0,0,0.75)",
        zIndex:          9999,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        padding:         "16px",
        backdropFilter:  "blur(4px)",
      }}
    >
      <div
        style={{
          background:    "linear-gradient(135deg, #1a1e2a, #13161e)",
          borderRadius:  "20px",
          border:        "1px solid rgba(220,38,38,0.3)",
          boxShadow:     "0 24px 60px rgba(0,0,0,0.6)",
          width:         "100%",
          maxWidth:      "400px",
          padding:       "32px 28px",
          position:      "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position:  "absolute",
            top:       "16px",
            right:     "16px",
            background: "rgba(255,255,255,0.08)",
            border:    "none",
            borderRadius: "50%",
            width:     "32px",
            height:    "32px",
            display:   "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:    "pointer",
            color:     "#9ca3af",
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width:          "56px",
              height:         "56px",
              background:     "linear-gradient(135deg, #dc2626, #7c3aed)",
              borderRadius:   "50%",
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              margin:         "0 auto 16px",
              boxShadow:      "0 8px 24px rgba(220,38,38,0.4)",
            }}
          >
            <Mail size={24} color="white" />
          </div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", margin: "0 0 8px" }}>
            Enter OTP
          </h2>
          <p style={{ color: "#9ca3af", fontSize: "13px", margin: 0 }}>
            We sent a 6-digit OTP to
          </p>
          <p style={{ color: "#e63946", fontSize: "13px", fontWeight: "600", margin: "4px 0 0" }}>
            {email}
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div
          style={{
            display:        "flex",
            gap:            "10px",
            justifyContent: "center",
            marginBottom:   "20px",
          }}
          onPaste={handlePaste}
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              autoFocus={index === 0}
              style={{
                width:       "46px",
                height:      "54px",
                textAlign:   "center",
                fontSize:    "24px",
                fontWeight:  "700",
                color:       "#fff",
                background:  digit ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)",
                border:      digit ? "2px solid #dc2626" : "2px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                outline:     "none",
                transition:  "all 0.2s",
                caretColor:  "#dc2626",
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background:    "rgba(220,38,38,0.12)",
              border:        "1px solid rgba(220,38,38,0.3)",
              borderRadius:  "10px",
              padding:       "10px 14px",
              marginBottom:  "16px",
              color:         "#fca5a5",
              fontSize:      "13px",
              textAlign:     "center",
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Timer */}
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          {timer > 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "13px" }}>
              OTP expires in{" "}
              <span style={{ color: timer < 60 ? "#e63946" : "#4ade80", fontWeight: "700" }}>
                {formatTime(timer)}
              </span>
            </p>
          ) : (
            <p style={{ color: "#e63946", fontSize: "13px", fontWeight: "600" }}>
              OTP has expired!
            </p>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify("")}
          disabled={loading || otp.some((d) => d === "")}
          style={{
            width:         "100%",
            padding:       "13px",
            borderRadius:  "12px",
            border:        "none",
            background:    loading || otp.some((d) => d === "")
              ? "rgba(220,38,38,0.4)"
              : "linear-gradient(135deg, #dc2626, #b91c1c)",
            color:         "#fff",
            fontSize:      "15px",
            fontWeight:    "700",
            cursor:        loading || otp.some((d) => d === "") ? "not-allowed" : "pointer",
            marginBottom:  "12px",
            boxShadow:     "0 4px 15px rgba(220,38,38,0.3)",
          }}
        >
          {loading ? "Verifying..." : "✅ Verify OTP"}
        </button>

        {/* Resend */}
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "13px", marginBottom: "8px" }}>
            Didn't receive OTP?
          </p>
          <button
            onClick={handleResend}
            disabled={resending || timer > 240} // allow resend after 1 minute
            style={{
              background:  "none",
              border:      "none",
              color:       resending || timer > 240 ? "#6b7280" : "#e63946",
              fontSize:    "13px",
              fontWeight:  "600",
              cursor:      resending || timer > 240 ? "not-allowed" : "pointer",
              display:     "flex",
              alignItems:  "center",
              gap:         "6px",
              margin:      "0 auto",
            }}
          >
            <RefreshCw size={13} />
            {resending ? "Sending..." : timer > 240 ? `Resend in ${formatTime(timer - 240)}` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
