import User from "../models/userModel.js";
import OTP from "../models/otpModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET      = "your_jwt_secret_here";
const TOKEN_EXPIRIES_IN = "24h";

// ── Helpers ────────────────────────────────────────────────────────────────
const emailIsValid  = (e) => /\S+@\S+\.\S+/.test(String(e || ""));
const extractCleanPhone = (p) => String(p || "").replace(/\D/g, "");
const mkToken       = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRIES_IN });
const generateOTP   = () => Math.floor(100000 + Math.random() * 900000).toString();

// ── Send OTP Email using emailService ──────────────────────────────────────
async function sendOTPEmail(toEmail, otpCode, userName) {
  const { sendBookingConfirmationEmail } = await import("../utils/emailService.js");

  // Reuse nodemailer transporter from emailService
  const nodemailer = (await import("nodemailer")).default;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from:    `"🎬 CINEVERSE" <${process.env.EMAIL_USER}>`,
    to:      toEmail,
    subject: "🔐 Your OTP for CINEVERSE Login",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f1f5f9;margin:0;padding:20px;">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.1);">
    
    <div style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:28px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:24px;margin:0;font-weight:800;letter-spacing:2px;">🎬 CINEVERSE</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">Login Verification</p>
    </div>

    <div style="padding:32px 24px;text-align:center;">
      <p style="color:#333;font-size:16px;margin-bottom:8px;">Hello <strong>${userName}</strong>! 👋</p>
      <p style="color:#555;font-size:14px;margin-bottom:24px;">Your One-Time Password for CINEVERSE login is:</p>
      
      <div style="background:#1a1e2a;border-radius:12px;padding:24px;margin:0 auto 24px;display:inline-block;min-width:220px;">
        <div style="color:#fff;font-size:44px;font-weight:900;letter-spacing:14px;font-family:monospace;">${otpCode}</div>
      </div>

      <p style="color:#e63946;font-size:13px;font-weight:600;margin-bottom:8px;">⏱️ This OTP expires in 5 minutes!</p>
      <p style="color:#888;font-size:12px;">If you did not request this OTP, please ignore this email.</p>
    </div>

    <div style="background:#1a1e2a;padding:16px;text-align:center;">
      <p style="color:#8890a4;font-size:12px;margin:0;">
        Thank you for choosing <strong style="color:#e63946;">CINEVERSE</strong>! 🎬
      </p>
    </div>

  </div>
</body>
</html>
    `,
  });

  console.log(`✅ OTP email sent to ${toEmail}: ${otpCode}`);
}

// ── Register ───────────────────────────────────────────────────────────────
export const registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, phone, birthday, password } = req.body || {};
    if (!fullName || !userName || !email || !phone || !birthday || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }
    if (typeof fullName !== "string" || fullName.trim().length < 3) {
      return res.status(400).json({ success: false, message: "FullName must be at least 3 characters long" });
    }
    if (typeof userName !== "string" || userName.trim().length < 3) {
      return res.status(400).json({ success: false, message: "UserName must be at least 3 characters long" });
    }
    if (!emailIsValid(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }
    const cleanPhone = extractCleanPhone(phone);
    if (cleanPhone.length < 6) {
      return res.status(400).json({ success: false, message: "Invalid phone number" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
    }
    const parsedBirthday = new Date(birthday);
    if (Number.isNaN(parsedBirthday.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid birthday format" });
    }
    const existingByEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingByEmail) {
      return res.status(400).json({ success: false, message: "Email already Exists" });
    }
    const existingByUserName = await User.findOne({ userName: userName.trim().toLowerCase() });
    if (existingByUserName) {
      return res.status(400).json({ success: false, message: "UserName already Exists" });
    }
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser        = await User.create({
      fullName:  fullName.trim(),
      userName:  userName.trim(),
      email:     email.toLowerCase().trim(),
      phone,
      birthday:  parsedBirthday,
      password:  hashedPassword,
    });
    const token       = mkToken({ id: newUser._id });
    const userToReturn = {
      id:       newUser._id,
      fullName: newUser.fullName,
      userName: newUser.userName,
      email:    newUser.email,
      phone:    newUser.phone,
      birthday: newUser.birthday,
    };
    return res.status(201).json({ success: true, message: "User registered successfully", token, user: userToReturn });
  } catch (error) {
    console.error("Error registering user:", error);
    if (error.code === 11000) {
      const dupkey = Object.keys(error.keyValue || {})[0];
      return res.status(400).json({ success: false, message: `${dupkey} Already Exists` });
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ── Login ──────────────────────────────────────────────────────────────────
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and Password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }
    const token = mkToken({ id: user._id.toString() });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
    isAdmin: user.isAdmin,   // ← ADD THIS
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ── Send OTP ───────────────────────────────────────────────────────────────
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body || {};

    if (!email || !emailIsValid(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check user exists
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email. Please register first.",
      });
    }

    // Delete old OTPs
    await OTP.deleteMany({ email: cleanEmail });

    // Generate OTP
    const otpCode = generateOTP();
    console.log(`🔐 Generated OTP for ${cleanEmail}: ${otpCode}`);

    // Save to DB
    await OTP.create({
      email:     cleanEmail,
      otp:       otpCode,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send email
    await sendOTPEmail(cleanEmail, otpCode, user.fullName || user.userName || "User");

    return res.status(200).json({
      success: true,
      message: `OTP sent to ${cleanEmail}. Valid for 5 minutes.`,
    });

  } catch (error) {
    console.error("❌ sendOTP error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP: " + error.message,
    });
  }
};

// ── Verify OTP ─────────────────────────────────────────────────────────────
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body || {};

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Find OTP
    const otpRecord = await OTP.findOne({ email: cleanEmail, isUsed: false });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP.",
      });
    }

    // Check expiry
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    // Check OTP match
    if (otpRecord.otp !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Find user and generate token
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const token = mkToken({ id: user._id.toString() });

    console.log(`✅ OTP verified for ${cleanEmail}`);

    return res.status(200).json({
      success: true,
      message: "OTP verified! Login successful.",
      token,
      user: {
        id:       user._id.toString(),
        fullName: user.fullName,
        userName: user.userName,
        email:    user.email,
        isAdmin: user.isAdmin,   // ← ADD THIS
      },
    });

  } catch (error) {
    console.error("❌ verifyOTP error:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};