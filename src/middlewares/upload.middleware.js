import multer from 'multer';
import path from 'path';

export const uploadCsv = multer({
    storage: multer.diskStorage({
        destination: 'tmp/',
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}${ext}`);
        },
    }),
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.csv', '.xlsx'].includes(ext)) {
            return cb(new Error('Chỉ hỗ trợ CSV hoặc XLSX'));
        }
        cb(null, true);
    },
});

