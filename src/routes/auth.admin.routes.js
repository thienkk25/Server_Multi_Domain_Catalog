import { Router } from 'express'
import { authAdminController } from '../controllers/auth.admin.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
const router = Router()

router.get('/', authMiddleware, checkRole(['admin']), authAdminController.getAll)
router.get('/:id', authMiddleware, checkRole(['admin']), authAdminController.getById)

router.patch('/:id/activate', authMiddleware, checkRole(['admin']), authAdminController.activateUser)
router.patch('/:id/deactivate', authMiddleware, checkRole(['admin']), authAdminController.deactivateUser)
router.post('/', authMiddleware, checkRole(['admin']), authAdminController.create)
router.patch('/:id', authMiddleware, checkRole(['admin']), authAdminController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), authAdminController.remove)

router.post('/grant-access', authMiddleware, checkRole(['admin']), authAdminController.grantUserAccess)

export default router