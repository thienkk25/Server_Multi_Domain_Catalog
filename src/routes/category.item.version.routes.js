import { Router } from "express";
import { authOptional } from '../middlewares/auth.optional.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemVersionController } from "../controllers/category.item.version.controller.js";


const router = Router()

router.get('/', authOptional, categoryItemVersionController.getAll)
router.get('/:id', categoryItemVersionController.getById)

// domain officer
router.post('/', authMiddleware, checkRole(['domainOfficer']), categoryItemVersionController.createVersion)
router.post('/:id/update', authMiddleware, checkRole(['domainOfficer']), categoryItemVersionController.updateVersion)
router.post('/:id/delete', authMiddleware, checkRole(['domainOfficer']), categoryItemVersionController.deleteVersion)

// approver
router.post('/:id/approve', authMiddleware, checkRole(['approver']), categoryItemVersionController.approveVersion)
router.post('/:id/reject', authMiddleware, checkRole(['approver']), categoryItemVersionController.rejectVersion)

// admin or domain officer with status = pending
router.delete('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), categoryItemVersionController.remove)

// admin
router.post('/:id/rollback', authMiddleware, checkRole(['admin']), categoryItemVersionController.rollbackVersion)

export default router