import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config.js';

/**
 * Almacenamiento en Cloudinary.
 * Las imágenes se suben directamente a la nube — no se escriben en disco local.
 * Esto es compatible con entornos serverless como Vercel.
 */
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'conecta/profile-pictures',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
            { quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes (jpg, png, webp).'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

export default upload;
