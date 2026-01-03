import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemController } from "../controllers/category.item.controller.js";


const router = Router()

router.get('/', categoryItemController.getAll)
router.get('/:id', categoryItemController.getById)

router.post('/', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemController.create)
router.post('/bulk', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemController.upsertMany)

router.patch('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemController.update)
router.delete('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemController.remove)

export default router