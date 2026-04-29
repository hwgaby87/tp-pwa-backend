/**
 * @file upload.middleware.js
 * @description Middleware para la gestión de carga de archivos (imágenes) utilizando Multer y Cloudinary.
 * Define diferentes configuraciones de almacenamiento para fotos de perfil y fotos de espacios de trabajo.
 */

import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config.js';

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes (jpg, png, webp).'), false);
    }
};

/**
 * Multer para fotos de perfil de usuario.
 * Sube a Cloudinary en la carpeta 'conecta/profile-pictures'.
 */
const profileStorage = new CloudinaryStorage({
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

const upload = multer({
    storage: profileStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

/**
 * Multer para imágenes de workspace.
 * Sube a Cloudinary en la carpeta 'conecta/workspace-images'.
 */
const workspaceStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'conecta/workspace-images',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 512, height: 512, crop: 'fill' },
            { quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

export const uploadWorkspaceImage = multer({
    storage: workspaceStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter
});

export default upload;
