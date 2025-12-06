import { domainService } from '../services/domain.service.js'
import { handle } from '../utils/handle.helper.js';

export const domainController = {
    getAll: handle(req => domainService.getAll(req.query)),
    getById: handle(req => domainService.getById(req.params.id)),
    create: handle(req => domainService.create(req.body)),
    createMany: handle(req => domainService.createMany(req.body)),
    upsertMany: handle(req => domainService.upsertMany(req.body)),
    update: handle(req => domainService.update(req.params.id, req.body)),
    remove: handle(req => domainService.remove(req.params.id)),
};