import { Router } from "express"
import { catalogLookupController } from '../controllers/catalog.lookup.controller.js'
const router = Router()

router.get("/", catalogLookupController.searchFlat)
router.get("/domains", catalogLookupController.getDomains)
router.get("/category-groups/:id", catalogLookupController.getCategoryGroups)

export default router