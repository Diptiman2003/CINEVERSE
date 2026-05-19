//movieModel.js
import mongoose from "mongoose";

const personSchema = new mongoose.Schema({
  
    name: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" }, //used for the cast
    file: { type: String, trim: true, default: "" }, // canonical file key
    File: { type: String, trim: true, default: "" }, // legacy key kept for old data

}, { 

    _id: false

});

const slotSchema = new mongoose.Schema({
    date: { type: String, trim: true, default: "" },
    time: { type: String, trim: true, default: "" },
    ampm: { type: String, enum: ["AM", "PM"], default: "AM" },
},{

    _id: false
});

const latestTrailerSchema = new mongoose.Schema({
    title: { type: String, trim: true },
    geners: [{ type: String, trim: true }],
    duration: { 
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    year: {type: Number },
    description: { type: String, trim: true },
    thumbnail: { type: String, trim: true }, // file name or URL
    videoId: { type: String, trim: true }, // storing the url
    directors: [personSchema],
    producers: [personSchema],
    singers: [personSchema],
},{

    _id: false
});

const movieSchema = new mongoose.Schema({

type: {
        type: String,
        enum:["normal", "featured", "releaseSoon", "latestTrailers"],
        default: "normal",
    },
trim: {
        type: String,
        enum:["normal", "featured", "releaseSoon", "latestTrailers"],
        default: "normal",
    },
movieName: { type: String, trim: true },
categories: [{ type: String }],
poster: { type: String, trim: true }, // file name or URL
trailerUrl: { type: String, trim: true },
videoUrl: { type: String, trim: true }, 
rating: { type: Number, default: 0 },
duration: { type: Number, default: 0 }, // total duration in minutes

// for pricing
slots: [slotSchema],
seatPrices: {
    standard: { type: Number, default: 0 },
    recliner: { type: Number, default: 0 },
},

auditorium: { type: String, trim: true, default: 'Audi 1' },

// people details
cast: [personSchema],
directors: [personSchema],
producers: [personSchema],

story: { type: String, trim: true },
latestTrailer: latestTrailerSchema,
latestTrailerSchema: latestTrailerSchema,

}, { timestamps: true 

});

const Movie = mongoose.models.Movie || mongoose.model("Movie", movieSchema);

export default Movie;
