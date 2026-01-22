import express from 'express';
import { uploadCsv } from '../middlewares/upload.middleware.js';
import {
    importSingleController,
    importCatalogController,
} from '../controllers/import.controller.js';

const router = express.Router();

// Import 1 bảng 
router.post('/single', uploadCsv.single('file'), importSingleController);

// Import domain + group + item chung
router.post('/catalog', uploadCsv.single('file'), importCatalogController);

export default router;
