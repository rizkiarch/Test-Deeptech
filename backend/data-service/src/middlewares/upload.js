import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ENV from '../config/env.js';

const uploadPath = ENV.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(ENV.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    },
    fileFilter: fileFilter
});

export const uploadSingle = upload.single('image');

export const uploadMultiple = upload.array('images', 5);

export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                status: 'error',
                message: 'File too large. Maximum size is 5MB',
                statusCode: 400
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                status: 'error',
                message: 'Too many files. Maximum is 5 files',
                statusCode: 400
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                status: 'error',
                message: 'Unexpected field name for file upload',
                statusCode: 400
            });
        }
    }

    if (error.message.includes('Only image files')) {
        return res.status(400).json({
            status: 'error',
            message: error.message,
            statusCode: 400
        });
    }

    next(error);
};

export const deleteFile = (filename) => {
    try {
        const filePath = path.join(uploadPath, filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error deleting file:', error);
        return false;
    }
};

export const getFileUrl = (req, filename) => {
    if (!filename) return null;
    // Use localhost for image URLs so they can be accessed from browser
    return `http://localhost/uploads/${filename}`;
};

export default upload;