import { categoryItemService } from '../services/category.item.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryItemController = {
    getAll: handle(req => categoryItemService.getAll(qs.parse(req.query))),
    getById: handle(req => categoryItemService.getById(req.params.id)),
    create: handle(req => categoryItemService.create(req.body)),
    createMany: handle(req => categoryItemService.createMany(req.body)),
    upsertMany: handle(req => categoryItemService.upsertMany(req.body)),
    update: handle(req => categoryItemService.update(req.params.id, req.body)),
    remove: handle(req => categoryItemService.remove(req.params.id)),
};