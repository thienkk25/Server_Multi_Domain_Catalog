import multer from 'multer';

export const uploadCsv = multer({
    dest: 'tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = [
            'text/csv',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error('Chỉ hỗ trợ CSV hoặc XLSX'));
        }
        cb(null, true);
    },
});
