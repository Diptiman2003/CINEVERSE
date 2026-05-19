import mongoose from "mongoose";

const userScema = new mongoose.Schema({
    fullName: { type: String, required: true},
    userName: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    isAdmin:  { type: Boolean, default: false },  // ← ADD THIS
    phone: { type: String, required: true},
    birthday: { type: String, required: true},
    password: { type: String, required: true},
    
}, { timestamps: true });    

const User = mongoose.model.user || mongoose.model('User', userScema);

export default User; 