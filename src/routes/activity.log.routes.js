import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { checkRole } from "../middlewares/role.middleware.js"
import { activityLogController } from "../controllers/activity.log.controller.js"

const router = Router()

router.get('/', authMiddleware, checkRole(['admin']), activityLogController.getAll)
router.get('/:id', authMiddleware, checkRole(['admin']), activityLogController.getById)

export default router