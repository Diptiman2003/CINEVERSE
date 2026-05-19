import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { createMovie, deleteMovie, getMovieById, getMovies } from '../controllers/moviesController.js';

const movieRouter = express.Router();

// ── Cloudinary config ──────────────────────────────────────
cloudinary.config({
  cloud_name: "dprdys76k",
  api_key:    "641895359766443",
  api_secret: "AFYexFDR97ng0cNpGjtfGkd0CO8",
});

// ── Cloudinary Storage ─────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:          "cineverse/movies",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation:  [{ width: 800, height: 1200, crop: "limit", quality: "auto" }],
  },
});

// ── Multer upload ──────────────────────────────────────────
const upload = multer({ storage }).fields([
  { name: "poster",          maxCount: 1  },
  { name: "trailerUrl",      maxCount: 1  },
  { name: "videoUrl",        maxCount: 1  },
  { name: "ltThumbnail",     maxCount: 1  },
  { name: "castFiles",       maxCount: 20 },
  { name: "directorFiles",   maxCount: 20 },
  { name: "producerFiles",   maxCount: 20 },
  { name: "ltDirectorFiles", maxCount: 20 },
  { name: "ltProducerFiles", maxCount: 20 },
  { name: "ltSingerFiles",   maxCount: 20 },
]);

// ── Routes ─────────────────────────────────────────────────
movieRouter.post("/",    upload, createMovie);
movieRouter.get("/",     getMovies);
movieRouter.get("/:id",  getMovieById);
movieRouter.delete("/:id", deleteMovie);

export default movieRouter;