import { Router } from "express"
import { catalogController } from "../controllers/catalog.controller.js"

const router = Router()

router.get("/domains", catalogController.getDomains)

router.get("/category-groups", catalogController.getCategoryGroups)
router.get("/category-groups/:id", catalogController.getCategoryGroupById)

router.get("/category-items", catalogController.searchCategoryItemsFlat)
router.get("/category-items/:id", catalogController.getCategoryItemById)

router.get("/sync/category-items", catalogController.syncCategoryItems)

export default router