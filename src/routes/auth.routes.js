import { Router } from 'express'
import { authController } from '../controllers/auth.controller.js'
import { validateMiddleware } from '../middlewares/validation.middleware.js'
import { authValidationSchema } from '../validations/auth.validation.js'
const router = Router()

router.post('/login', validateMiddleware(authValidationSchema.signInWithPassword), authController.login)
router.post('/register', authController.register)
router.post('/logout', authController.signOut)

export default router