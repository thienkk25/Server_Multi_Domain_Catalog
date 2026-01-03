import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.get('/me', authMiddleware, userController.me)
router.get('/', authMiddleware, userController.getUser)
router.get('/role', authMiddleware, userController.role)
router.patch('/change-password', authMiddleware, userController.changePassword)
router.patch('/update-phone', authMiddleware, userController.updatePhone)
router.patch('/update-fullname', authMiddleware, userController.updateFullName)

export default router