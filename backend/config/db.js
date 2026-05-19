//db.js
import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://sarcardiptiman03_db_user:Moviebook123@cluster0.vbqujpn.mongodb.net/MovieBookSystem')
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB", err);
});
}

// mongodb+srv://sarcardiptiman03_db_user:Moviebook123@cluster0.vbqujpn.mongodb.net/MovieBookSystem?appName=Cluster0