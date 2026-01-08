import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { legalDocumentController } from "../controllers/legal.document.controller.js";
import multer from 'multer'
const upload = multer()

const router = Router()

router.get('/', legalDocumentController.getAll)
router.get('/:id', legalDocumentController.getById)

router.post('/', authMiddleware, checkRole(['admin']), upload.single('file'), legalDocumentController.create)
router.post('/bulk', authMiddleware, checkRole(['admin']), legalDocumentController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin']), legalDocumentController.upsertMany)

router.patch('/:id', authMiddleware, checkRole(['admin']), legalDocumentController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), legalDocumentController.remove)

router.get('/download', legalDocumentController.getSignedUrl)

export default router