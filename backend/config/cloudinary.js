
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

// ── Configure Cloudinary ───────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Cloudinary Storage for Multer ──────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'cineverse/movies';

    // Organise into subfolders by file field
    if (file.fieldname === 'poster')           folder = 'cineverse/posters';
    if (file.fieldname === 'trailerUrl')       folder = 'cineverse/trailers';
    if (file.fieldname === 'videoUrl')         folder = 'cineverse/videos';
    if (file.fieldname === 'ltThumbnail')      folder = 'cineverse/thumbnails';
    if (file.fieldname.includes('cast'))       folder = 'cineverse/cast';
    if (file.fieldname.includes('director'))   folder = 'cineverse/directors';
    if (file.fieldname.includes('producer'))   folder = 'cineverse/producers';
    if (file.fieldname.includes('singer'))     folder = 'cineverse/singers';

    return {
      folder,
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'mp4', 'mov'],
      transformation: file.fieldname === 'poster'
        ? [{ width: 800, height: 1200, crop: 'limit', quality: 'auto' }]
        : [],
    };
  },
});

// ── Multer upload with Cloudinary storage ──────────────────────────────────
export const upload = multer({ storage }).fields([
  { name: 'poster',          maxCount: 1  },
  { name: 'trailerUrl',      maxCount: 1  },
  { name: 'videoUrl',        maxCount: 1  },
  { name: 'ltThumbnail',     maxCount: 1  },
  { name: 'castFiles',       maxCount: 20 },
  { name: 'directorFiles',   maxCount: 20 },
  { name: 'producerFiles',   maxCount: 20 },
  { name: 'ltDirectorFiles', maxCount: 20 },
  { name: 'ltProducerFiles', maxCount: 20 },
  { name: 'ltSingerFiles',   maxCount: 20 },
]);

// ── Delete image from Cloudinary by URL ───────────────────────────────────
export async function deleteFromCloudinary(url) {
  try {
    if (!url || !url.includes('cloudinary')) return;
    // Extract public_id from URL
    const parts    = url.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const folder   = parts[parts.length - 2];
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
  } catch (err) {
    console.error('Cloudinary delete error:', err.message);
  }
}

export default cloudinary