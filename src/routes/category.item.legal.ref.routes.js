import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemLegalRefController } from "../controllers/category.item.legal.ref.controller.js";


const router = Router()

router.get('/', authMiddleware, categoryItemLegalRefController.getAll)
router.get('/:id', authMiddleware, categoryItemLegalRefController.getById)

router.post('/', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemLegalRefController.create)
router.post('/bulk', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemLegalRefController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemLegalRefController.upsertMany)

router.put('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemLegalRefController.update)
router.delete('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemLegalRefController.remove)

export default router