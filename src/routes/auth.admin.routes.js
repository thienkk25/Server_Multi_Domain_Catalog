import { Router } from 'express'
import { authAdminController } from '../controllers/auth.admin.controller.js'
import { checkRole } from '../middlewares/role.middleware.js'
const router = Router()

router.use(checkRole(['admin']))

router.get('/', authAdminController.getAll)
router.get('/:id', authAdminController.getById)

router.patch('/:id/activate', authAdminController.activateUser)
router.patch('/:id/deactivate', authAdminController.deactivateUser)
router.post('/', authAdminController.create)
router.patch('/:id', authAdminController.update)
router.delete('/:id', authAdminController.remove)

router.post('/grant-access', authAdminController.grantUserAccess)

export default router