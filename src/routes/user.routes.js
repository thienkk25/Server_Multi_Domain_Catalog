import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { userValidationSchema } from '../validations/user.validation.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.patch('/change-password', authMiddleware, userController.changePassword)
router.patch('/update-phone', validateMiddleware(userValidationSchema.updatePhoneUser), authMiddleware, userController.updatePhone)
router.patch('/update-fullname', validateMiddleware(userValidationSchema.updateFullNameUser), authMiddleware, userController.updateFullName)

export default router