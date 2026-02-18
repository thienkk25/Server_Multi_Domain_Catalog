import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemController } from "../controllers/category.item.controller.js";


const router = Router()

router.get('/', categoryItemController.getAll)
router.get('/:id', categoryItemController.getById)

router.post('/', checkRole(['admin']), categoryItemController.create)

router.patch('/:id', checkRole(['admin']), categoryItemController.update)
router.delete('/:id', checkRole(['admin']), categoryItemController.remove)

export default router