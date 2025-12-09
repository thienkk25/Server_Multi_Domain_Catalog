import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
const router = Router()

router.post('/login', authController.login)
router.post('/register', authMiddleware, checkRole(['admin']), authController.register)
router.post('/logout', authController.signOut)

export default router