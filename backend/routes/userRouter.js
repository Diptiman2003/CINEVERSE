import express from 'express';
import { registerUser, loginUser, sendOTP, verifyOTP } from '../controllers/userController.js';
import User from '../models/userModel.js';

const userRouter = express.Router();

// ── Existing routes ────────────────────────────────────────────────────────
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// ── OTP routes ─────────────────────────────────────────────────────────────
userRouter.post('/send-otp', sendOTP);
userRouter.post('/verify-otp', verifyOTP);

// ── GET all users (admin) ──────────────────────────────────────────────────
// GET /api/auth/users
userRouter.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')   // never send password
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

// ── DELETE user by ID (admin) ──────────────────────────────────────────────
// DELETE /api/auth/users/:id
userRouter.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default userRouter;