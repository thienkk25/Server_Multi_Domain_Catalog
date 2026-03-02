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

router.get('/', checkRole(['admin', 'domainOfficer', 'approver']), legalDocumentController.getAll)
router.get('/documents/with-file', checkRole(['admin', 'domainOfficer', 'approver']), legalDocumentController.getLegalDocumentsWithFile)
router.get('/download', checkRole(['admin', 'domainOfficer', 'approver']), legalDocumentController.getSignedUrl)
router.get('/:id', checkRole(['admin', 'domainOfficer', 'approver']), legalDocumentController.getById)

router.post('/', checkRole(['admin']), upload.single('file'), legalDocumentController.create)

router.patch('/:id', checkRole(['admin']), upload.single('file'), legalDocumentController.update)
router.delete('/:id', checkRole(['admin']), legalDocumentController.remove)

export default router
