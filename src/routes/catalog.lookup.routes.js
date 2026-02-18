import { Router } from "express"
import { catalogLookupController } from '../controllers/catalog.lookup.controller.js'
const router = Router()

router.get("/category-items", catalogLookupController.searchFlat)
router.get("/category-items/:id", catalogLookupController.getByIdItem)
router.get("/category-items/sync", catalogLookupController.syncItems)

router.get("/domains", catalogLookupController.getDomainsRef)
router.get("/category-groups", catalogLookupController.getCategoryGroupsRef)
router.get("/category-groups/:id", catalogLookupController.getGroupDetail)


export default router