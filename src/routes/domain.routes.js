import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { domainController } from "../controllers/domain.controller.js";


const router = Router()

router.get('/lookup', checkRole(['admin', 'domainOfficer', 'approver']), domainController.lookup)

router.get('/', checkRole(['admin', 'domainOfficer', 'approver']), domainController.getAll)
router.get('/:id', checkRole(['admin', 'domainOfficer', 'approver']), domainController.getById)

router.post('/', checkRole(['admin']), domainController.create)

router.patch('/:id', checkRole(['admin']), domainController.update)
router.delete('/:id', checkRole(['admin']), domainController.remove)


export default router