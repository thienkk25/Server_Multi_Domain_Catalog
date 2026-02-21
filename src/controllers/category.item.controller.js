import { categoryItemService } from '../services/category.item.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryItemController = {
    getAll: handle(req => categoryItemService.getAll(qs.parse(req.query), req.role)),
    getById: handle(req => categoryItemService.getById(req.params.id, req.role)),
    create: handle(req => categoryItemService.create(req.user.id, req.role, req.body)),
    update: handle(req => categoryItemService.update(req.params.id, req.user.id, req.role, req.body)),
    remove: handle(req => categoryItemService.remove(req.params.id)),
};