import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemVersionController } from "../controllers/category.item.version.controller.js";


const router = Router()

router.get('/', categoryItemVersionController.getAll)
router.get('/:id', categoryItemVersionController.getById)

router.post('/', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemVersionController.create)
router.post('/bulk', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemVersionController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemVersionController.upsertMany)

router.patch('/:id', authMiddleware, checkRole(['admin', 'approver']), categoryItemVersionController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), categoryItemVersionController.remove)

export default router