import { Router } from 'express'
import { authAdminController } from '../controllers/auth.admin.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
const router = Router()

router.get('/', authMiddleware, checkRole(['admin']), authAdminController.getAll)
router.get('/:id', authMiddleware, checkRole(['admin']), authAdminController.getById)

router.post('/', authMiddleware, checkRole(['admin']), authAdminController.create)
router.delete('/:id', authMiddleware, checkRole(['admin']), authAdminController.remove)

export default router