import { catalogLookupService } from '../services/catalog.lookup.service.js'
import { handle } from '../utils/handle.helper.js'
export const catalogLookupController = {
    searchCategoryItemsFlat: handle(req => catalogLookupService.searchCategoryItemsFlat(req.query)),
    getCategoryItemById: handle(req => catalogLookupService.getCategoryItemById(req.params.id)),
    syncCategoryItems: handle(req => catalogLookupService.syncCategoryItems(req.query)),
    getDomainsRef: handle(req => catalogLookupService.getDomainsRef()),
    getCategoryGroupsRef: handle(req => catalogLookupService.getCategoryGroupsRef(req.query)),
    getGroupDetail: handle(req => catalogLookupService.getGroupDetail(req.params.id)),
}