import { activityLogService } from '../services/activity.log.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const activityLogController = {
    getAll: handle(req => activityLogService.getAll(qs.parse(req.query)))
}