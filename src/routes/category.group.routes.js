import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { categoryGroupController } from "../controllers/category.group.controller.js";


const router = Router()

router.use(checkRole(['admin', 'domainOfficer']))

router.get('/lookup', categoryGroupController.lookup)

router.get('/', categoryGroupController.getAll)
router.get('/:id', categoryGroupController.getById)

router.post('/', categoryGroupController.create)

router.patch('/:id', categoryGroupController.update)
router.delete('/:id', categoryGroupController.remove)


export default router