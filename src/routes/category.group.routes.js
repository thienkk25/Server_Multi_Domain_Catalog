import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryGroupController } from "../controllers/category.group.controller.js";


const router = Router()


router.get('/lookup', checkRole(['admin', 'domainOfficer', 'approver']), categoryGroupController.lookup)

router.get('/', checkRole(['admin', 'domainOfficer', 'approver']), categoryGroupController.getAll)
router.get('/:id', checkRole(['admin', 'domainOfficer', 'approver']), categoryGroupController.getById)

router.post('/', checkRole(['admin', 'domainOfficer']), categoryGroupController.create)

router.patch('/:id', checkRole(['admin', 'domainOfficer']), categoryGroupController.update)
router.delete('/:id', checkRole(['admin', 'domainOfficer']), categoryGroupController.remove)


export default router