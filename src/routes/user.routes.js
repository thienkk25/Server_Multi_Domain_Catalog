import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { userValidationSchema } from '../validations/user.validation.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.put('/change-password', authMiddleware, userController.changePasswordUser)
router.put('/update-phone', validateMiddleware(userValidationSchema.updatePhoneUser), authMiddleware, userController.updatePhoneUser)
router.put('/update-fullname', validateMiddleware(userValidationSchema.updateFullNameUser), authMiddleware, userController.updateFullNameUser)

export default router