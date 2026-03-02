import { catalogService } from '../services/catalog.service.js'
import { handle } from '../utils/handle.helper.js'
export const catalogController = {
    getDomains: handle(req => catalogService.getDomains(req.query, req.apiKey)),
    getDomainById: handle(req => catalogService.getDomainById(req.params.id, req.apiKey)),
    getCategoryGroups: handle(req => catalogService.getCategoryGroups(req.query, req.apiKey)),
    getCategoryGroupById: handle(req => catalogService.getCategoryGroupById(req.params.id, req.apiKey)),
    getCategoryItems: handle(req => catalogService.getCategoryItems(req.query, req.apiKey)),
    getCategoryItemById: handle(req => catalogService.getCategoryItemById(req.params.id, req.apiKey)),
    syncCategoryItems: handle(req => catalogService.syncCategoryItems(req.query, req.apiKey)),
}