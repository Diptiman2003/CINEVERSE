import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const JWT_SECRET = "your_jwt_secret_here";

export default async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
    }
    
    const token = authHeader.split(" ")[1];

    // Verify the token
    try {
        const payLoad = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payLoad.id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
        }
        req.user = user; // Attach user to request object
        next();
    } catch (error) {
        console.error("JWT verifying token:", error);
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" })
    }
}