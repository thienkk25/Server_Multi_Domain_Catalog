import { Router } from "express";
import { checkRole } from '../middlewares/role.middleware.js'
import { apiKeyController } from "../controllers/api.key.controller.js";


const router = Router()

router.use(checkRole(['admin']))

router.get('/', apiKeyController.getAll)
router.get('/:id', apiKeyController.getById)

router.post('/', apiKeyController.create)

router.patch('/:id', apiKeyController.revoke)
router.delete('/:id', apiKeyController.remove)

export default router