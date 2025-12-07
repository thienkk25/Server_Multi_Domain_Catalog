import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware"
import { checkRole } from "../middlewares/role.middleware"
import { activityLogController } from "../controllers/activity.log.controller"

const router = Router()

router.get('/', authMiddleware, checkRole['admin'], activityLogController.getAll)

export default router