import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { domainController } from "../controllers/domain.controller.js";


const router = Router()

router.get('/', domainController.getAll)
router.get('/:id', domainController.getById)

router.post('/', authMiddleware, checkRole(['admin', 'domainOfficer']), domainController.create)
router.post('/bulk', authMiddleware, checkRole(['admin', 'domainOfficer']), domainController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin', 'domainOfficer']), domainController.upsertMany)

router.put('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), domainController.update)
router.delete('/:id', authMiddleware, checkRole(['admin', 'domainOfficer']), domainController.remove)

export default router