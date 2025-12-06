import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { domainController } from "../controllers/domain.controller.js";


const router = Router()

router.get('/', domainController.getAll)
router.get('/:id', domainController.getById)

router.post('/', authMiddleware, domainController.create)
router.post('/bulk', authMiddleware, domainController.createMany)

router.post('/bulk/upsert', authMiddleware, domainController.upsertMany)

router.patch('/:id', authMiddleware, domainController.update)
router.delete('/:id', authMiddleware, domainController.remove)

export default router