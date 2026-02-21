import { Router } from "express"
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.get('/profile', userController.getProfile)
router.get('/role', userController.role)
router.patch('/change-password', userController.changePassword)
router.patch('/update-profile', userController.updateProfile)

export default router