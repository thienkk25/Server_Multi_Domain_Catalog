import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { domainController } from "../controllers/domain.controller.js";


const router = Router()

router.get('/', checkRole(['admin', 'domainOfficer']), domainController.getAll)
router.get('/:id', checkRole(['admin', 'domainOfficer']), domainController.getById)

router.post('/', checkRole(['admin']), domainController.create)

router.patch('/:id', checkRole(['admin']), domainController.update)
router.delete('/:id', checkRole(['admin']), domainController.remove)

router.get('/lookup', domainController.lookup)

export default router