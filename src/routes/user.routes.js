import { Router } from "express"
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { userValidation } from '../validations/user.validation.js'
import { userController } from '../controllers/user.controller.js'
const router = Router()

router.put('/change-password', authMiddleware, userController.changePasswordUserController)
router.put('/update-phone', validateMiddleware(userValidation.updatePhoneUserSchema), authMiddleware, userController.updatePhoneUserController)
router.put('/update-fullname', validateMiddleware(userValidation.updateFullNameUserSchema), authMiddleware, userController.updateFullNameUserController)

export default router