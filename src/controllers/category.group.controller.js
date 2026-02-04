import { categoryGroupService } from '../services/category.group.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryGroupController = {
    getAll: handle(req => categoryGroupService.getAll(qs.parse(req.query))),
    getById: handle(req => categoryGroupService.getById(req.params.id)),
    create: handle(req => categoryGroupService.create(req.body)),
    update: handle(req => categoryGroupService.update(req.params.id, req.body)),
    remove: handle(req => categoryGroupService.remove(req.params.id)),
};