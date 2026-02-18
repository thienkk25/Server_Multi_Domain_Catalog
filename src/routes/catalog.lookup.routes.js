import { Router } from "express"
import { catalogLookupController } from '../controllers/catalog.lookup.controller.js'
const router = Router()

router.get("/category-items", catalogLookupController.searchCategoryItemsFlat)
router.get("/category-items/sync", catalogLookupController.syncCategoryItems)
router.get("/category-items/:id", catalogLookupController.getCategoryItemById)

router.get("/domains", catalogLookupController.getDomainsRef)
router.get("/category-groups", catalogLookupController.getCategoryGroupsRef)
router.get("/category-groups/:id", catalogLookupController.getGroupDetail)


export default router