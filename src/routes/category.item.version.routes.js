import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemVersionController } from "../controllers/category.item.version.controller.js";


const router = Router()

router.get('/', checkRole(['admin', 'approver', 'domainOfficer']), categoryItemVersionController.getAll)
router.get('/:id', checkRole(['admin', 'approver', 'domainOfficer']), categoryItemVersionController.getById)
router.get('/:id/history', checkRole(['admin', 'approver', 'domainOfficer']), categoryItemVersionController.getHistoryVersion)

// domain officer
router.post('/', checkRole(['domainOfficer']), categoryItemVersionController.createVersion)
router.post('/:id/update', checkRole(['domainOfficer']), categoryItemVersionController.updateVersion)
router.post('/:id/delete', checkRole(['domainOfficer']), categoryItemVersionController.deleteVersion)

// approver
router.post('/:id/approve', checkRole(['approver']), categoryItemVersionController.approveVersion)
router.post('/:id/reject', checkRole(['approver']), categoryItemVersionController.rejectVersion)

// admin or domain officer with status = pending
router.delete('/:id', checkRole(['admin', 'domainOfficer']), categoryItemVersionController.remove)

// admin
router.post('/:id/rollback', checkRole(['admin']), categoryItemVersionController.rollbackVersion)

export default router