import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { legalDocumentController } from "../controllers/legal.document.controller.js";
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});


const router = Router()

router.get('/', legalDocumentController.getAll)
router.get('/:id', legalDocumentController.getById)
router.get('/documents/with-file', legalDocumentController.getLegalDocumentsWithFile)

router.post('/', authMiddleware, checkRole(['admin']), upload.single('file'), legalDocumentController.create)

router.patch('/:id', authMiddleware, checkRole(['admin']), upload.single('file'), legalDocumentController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), legalDocumentController.remove)

router.get('/download', legalDocumentController.getSignedUrl)

export default router