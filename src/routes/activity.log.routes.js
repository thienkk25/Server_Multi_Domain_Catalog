import { Router } from "express"
import { checkRole } from "../middlewares/role.middleware.js"
import { activityLogController } from "../controllers/activity.log.controller.js"

const router = Router()

router.use(checkRole(['admin']))

router.get('/', activityLogController.getAll)
router.get('/:id', activityLogController.getById)

export default router