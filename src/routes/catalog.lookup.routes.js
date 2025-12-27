import { Router } from "express"
import { catalogLookupController } from '../controllers/catalog.lookup.controller.js'
const router = Router()

router.get("/", catalogLookupController.searchFlat)
router.get("/domains", catalogLookupController.getDomainsRef)
router.get("/category-groups/:id", catalogLookupController.getCategoryGroupsRef)

export default router