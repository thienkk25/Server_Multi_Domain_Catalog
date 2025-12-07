import { activityLogService } from '../services/activity.log.service.js'
import { handle } from '../utils/handle.helper.js'

export const activityLogController = {
    getAll: handle(req => activityLogService.getAll(req.query))
}