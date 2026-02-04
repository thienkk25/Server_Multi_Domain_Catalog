import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryItemController } from "../controllers/category.item.controller.js";


const router = Router()

router.get('/', categoryItemController.getAll)
router.get('/:id', categoryItemController.getById)

router.post('/', authMiddleware, checkRole(['admin']), categoryItemController.create)

router.patch('/:id', authMiddleware, checkRole(['admin']), categoryItemController.update)
router.delete('/:id', authMiddleware, checkRole(['admin']), categoryItemController.remove)

export default router