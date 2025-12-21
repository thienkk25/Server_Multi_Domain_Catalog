import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { officerDomainController } from "../controllers/officer.domain.controller.js";


const router = Router()

router.get('/', officerDomainController.getAll)
router.get('/:id', officerDomainController.getById)

router.post('/', authMiddleware, checkRole(['admin']), officerDomainController.create)
router.post('/bulk', authMiddleware, checkRole(['admin']), officerDomainController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin']), officerDomainController.upsertMany)

router.put('/:id', authMiddleware, checkRole(['admin']), officerDomainController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), officerDomainController.remove)

export default router