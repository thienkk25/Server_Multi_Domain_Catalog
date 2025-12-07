import { categoryItemVersionService } from '../services/category.item.version.service.js'
import { handle } from '../utils/handle.helper.js';

export const categoryItemVersionController = {
    getAll: handle(req => categoryItemVersionService.getAll(req.query)),
    getById: handle(req => categoryItemVersionService.getById(req.params.id)),
    create: handle(req => categoryItemVersionService.create(req.body)),
    createMany: handle(req => categoryItemVersionService.createMany(req.body)),
    upsertMany: handle(req => categoryItemVersionService.upsertMany(req.body)),
    update: handle(req => categoryItemVersionService.update(req.params.id, req.body)),
    remove: handle(req => categoryItemVersionService.remove(req.params.id)),
};