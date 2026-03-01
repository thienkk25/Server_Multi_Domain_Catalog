import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { uploadCsv } from '../middlewares/upload.middleware.js';
import {
    importSingleController,
    importCatalogController,
} from '../controllers/import.controller.js';

const router = Router()

// Import 1 bảng 
router.post('/single', checkRole(['admin', 'domainOfficer']), uploadCsv.single('file'), importSingleController);

// Import domain + group + item chung
router.post('/catalog', checkRole(['admin']), uploadCsv.single('file'), importCatalogController);

export default router;
