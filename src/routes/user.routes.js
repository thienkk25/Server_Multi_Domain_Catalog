import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.get('/', authMiddleware, userController.me)
router.get('/profile', authMiddleware, userController.getProfile)
router.get('/role', authMiddleware, userController.role)
router.patch('/change-password', authMiddleware, userController.changePassword)
router.patch('/update-profile', authMiddleware, userController.updateProfile)

export default router