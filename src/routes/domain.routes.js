import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { domainController } from "../controllers/domain.controller.js";


const router = Router()

router.get('/', domainController.getAll)
router.get('/:id', domainController.getById)

router.post('/', checkRole(['admin', 'domainOfficer']), domainController.create)

router.patch('/:id', checkRole(['admin', 'domainOfficer']), domainController.update)
router.delete('/:id', checkRole(['admin', 'domainOfficer']), domainController.remove)

export default router