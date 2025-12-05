import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authValidation } from '../validations/auth.validation.js'
const router = Router()

router.post('/login', validateMiddleware(authValidation.signInWithPasswordSchema), authController.loginController)
router.post('/register', authController.registerController)
router.post('/logout', authController.signOutController)

export default router