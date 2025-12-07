import { categoryItemLegalRefService } from '../services/category.item.legal.ref.service.js'
import { handle } from '../utils/handle.helper.js';

export const categoryItemLegalRefController = {
    getAll: handle(req => categoryItemLegalRefService.getAll(req.query)),
    getById: handle(req => categoryItemLegalRefService.getById(req.params.id)),
    create: handle(req => categoryItemLegalRefService.create(req.body)),
    createMany: handle(req => categoryItemLegalRefService.createMany(req.body)),
    upsertMany: handle(req => categoryItemLegalRefService.upsertMany(req.body)),
    update: handle(req => categoryItemLegalRefService.update(req.params.id, req.body)),
    remove: handle(req => categoryItemLegalRefService.remove(req.params.id)),
};