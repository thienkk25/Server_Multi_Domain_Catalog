import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { apiKeyController } from "../controllers/api.key.controller.js";


const router = Router()

router.get('/', apiKeyController.getAll)
router.get('/:id', apiKeyController.getById)

router.post('/', authMiddleware, checkRole(['admin']), apiKeyController.create)
router.post('/bulk', authMiddleware, checkRole(['admin']), apiKeyController.createMany)

router.post('/bulk/upsert', authMiddleware, checkRole(['admin']), apiKeyController.upsertMany)

router.patch('/:id', authMiddleware, checkRole(['admin']), apiKeyController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), apiKeyController.remove)

export default router