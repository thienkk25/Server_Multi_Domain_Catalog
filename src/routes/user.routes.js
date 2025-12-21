import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.put('/change-password', authMiddleware, userController.changePassword)
router.put('/update-phone', authMiddleware, userController.updatePhone)
router.put('/update-fullname', authMiddleware, userController.updateFullName)

export default router