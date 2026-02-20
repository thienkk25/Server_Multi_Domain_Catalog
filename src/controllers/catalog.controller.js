import { catalogService } from '../services/catalog.service.js'
import { handle } from '../utils/handle.helper.js'
export const catalogController = {
    getDomains: handle(req => catalogService.getDomainssRef()),
    getDomainById: handle(req => catalogService.getDomainById(req.params.id)),
    getCategoryGroups: handle(req => catalogService.getCategoryGroups(req.query)),
    getCategoryGroupById: handle(req => catalogService.getCategoryGroupById(req.params.id)),
    getCategoryItems: handle(req => catalogService.getCategoryItems(req.query)),
    getCategoryItemById: handle(req => catalogService.getCategoryItemById(req.params.id)),
    syncCategoryItems: handle(req => catalogService.syncCategoryItems(req.query)),
}