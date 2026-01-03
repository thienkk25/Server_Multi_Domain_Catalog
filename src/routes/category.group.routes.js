import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryGroupController } from "../controllers/category.group.controller.js";


const router = Router()

router.get('/', categoryGroupController.getAll)
router.get('/:id', categoryGroupController.getById)

router.post('/', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryGroupController.create)
router.post('/bulk', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryGroupController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryGroupController.upsertMany)

router.patch('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryGroupController.update)
router.delete('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryGroupController.remove)

export default router