// // import express from 'express';
// // import multer from 'multer';
// // import path from 'path';
// // import { createMovie ,deleteMovie,getMovieById, getMovies } from '../controllers/moviesController.js';

// // const movieRouter = express.Router();

// // const storage = multer.diskStorage({
// //     destination:(res,file, cb) => {
// //         cb(null,path.join(process.cwd(),'uploads'))
// //     },
// //     filename:(req ,file,cb) => {
// //         const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
// //         const ext = path.extname(file.originalname);
// //         cb(null,`movie-${unique}${ext}`)
// //     },
// // });

// // const upload = multer({storage}).fields([
// //   { name: "poster", maxCount: 1 },
// //   { name: "trailerUrl", maxCount: 1 },
// //   { name: "videoUrl", maxCount: 1 },
// //   { name: "ltThumbnail", maxCount: 1 },
// //   { name: "castFiles", maxCount: 20 },
// //   { name: "directorFiles", maxCount: 20 },
// //   { name: "producerFiles", maxCount: 20 },
// //   { name: "ltDirectorFiles", maxCount: 20 },
// //   { name: "ltProducerFiles", maxCount: 20 },
// //   { name: "ltSingerFiles", maxCount: 20 },
// // ]);


// // movieRouter.post('/' , upload,createMovie);
// // movieRouter.get('/' ,getMovies);
// // movieRouter.get('/:id' , getMovieById);
// // movieRouter.delete('/:id' , deleteMovie);

// // export default movieRouter;

// //for clodinary
// // movieRouter.js
// // Place in: backend/routes/movieRouter.js — replace existing

// // import express from 'express';
// // import { createMovie, deleteMovie, getMovieById, getMovies } from '../controllers/moviesController.js';
// // import { upload } from '../config/cloudinary.js';   // ← NEW

// // const movieRouter = express.Router();

// // // Now uses Cloudinary storage instead of local disk
// // movieRouter.post('/', upload, createMovie);
// // movieRouter.get('/', getMovies);
// // movieRouter.get('/:id', getMovieById);
// // movieRouter.delete('/:id', deleteMovie);

// // export default movieRouter;

// // movieRouter.js
// // Place in: backend/routes/movieRouter.js — replace existing
// // Supports BOTH: paste URL link OR upload file from computer

// import express from 'express';
// import { createMovie, deleteMovie, getMovieById, getMovies } from '../controllers/moviesController.js';
// import multer from 'multer';
// import { v2 as cloudinary } from 'cloudinary';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import dotenv from 'dotenv';
// dotenv.config();

// ///////////////////////chatgpt
// // import { upload } from '../config/cloudinary.js';
// ////////////////////////////
// const movieRouter = express.Router();

// // ── Configure Cloudinary ──────────────────────────────────────────────────
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key:    process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// ////////////////////first claude sent this then chatgpt remove this 
// // cloudinary.config({
// //   cloud_name: "dprdys76k",
// //   api_key:    "641895359766443",
// //   api_secret: "AFYexFDR97ng0cNpGjtfGkd0CO8",
// // });
// ///////////////////////////////////////////////

// // ── Cloudinary Storage ────────────────────────────────────────────────────
// ///////////////////////////////////////////chatgpt
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder:          'cineverse/movies',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
//     transformation:  [{ width: 800, height: 1200, crop: 'limit', quality: 'auto' }],
//   },
// });
// /////////////////////////////////////chatgpt
// // ── Multer with Cloudinary ────────────────────────────────────────────────
// ////////////////////////////////////////chatgpt
// const upload = multer({ storage }).fields([
//   { name: 'poster',          maxCount: 1  },
//   { name: 'trailerUrl',      maxCount: 1  },
//   { name: 'videoUrl',        maxCount: 1  },
//   { name: 'ltThumbnail',     maxCount: 1  },
//   { name: 'castFiles',       maxCount: 20 },
//   { name: 'directorFiles',   maxCount: 20 },
//   { name: 'producerFiles',   maxCount: 20 },
//   { name: 'ltDirectorFiles', maxCount: 20 },
//   { name: 'ltProducerFiles', maxCount: 20 },
//   { name: 'ltSingerFiles',   maxCount: 20 },
// ]);
// ///////////////////////////////////////////////////////////

// // ── Middleware: handle both file upload AND url link ───────────────────────
// /////////////////////////////////////chatgpt
// const smartUpload = (req, res, next) => {
//   upload(req, res, (err) => {
//     if (err) {
//       console.error("Upload error:", err.message);
//       // If file upload fails, still continue (maybe they used URL link)
//       return next();
//     }

//     // If file was uploaded via Cloudinary, get its URL
//     if (req.files?.poster?.[0]?.path) {
//       req.body.poster = req.files.poster[0].path; // Cloudinary URL
//       console.log("✅ Poster uploaded to Cloudinary:", req.body.poster);
//     }
//     // If no file uploaded, check if URL was provided in body (old behavior)
//     // req.body.poster already has the URL from form text input

//     next();
//   });
// };
//      //////////////////////chatgpt
// // ── Routes ────────────────────────────────────────────────────────────────
// movieRouter.post('/',     smartUpload, createMovie);//chatgpt
// // movieRouter.post('/', upload, createMovie);
// movieRouter.get('/',      getMovies);
// movieRouter.get('/:id',   getMovieById);
// movieRouter.delete('/:id', deleteMovie);

// export default movieRouter;




















// movieRouter.js
// Place in: backend/routes/movieRouter.js

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