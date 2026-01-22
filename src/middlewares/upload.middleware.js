import multer from 'multer';

export const uploadCsv = multer({
    dest: 'tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
});
