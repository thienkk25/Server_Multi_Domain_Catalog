import { categoryGroupService } from '../services/category.group.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryGroupController = {
    getAll: handle(req => categoryGroupService.getAll(qs.parse(req.query), req.role)),
    getById: handle(req => categoryGroupService.getById(req.params.id, req.role)),
    create: handle(req => categoryGroupService.create(req.role, req.body)),
    update: handle(req => categoryGroupService.update(req.params.id, req.role, req.body)),
    remove: handle(req => categoryGroupService.remove(req.params.id, req.role)),
    lookup: handle(req => categoryGroupService.lookup(req.role, req.query)),
};