import { apiKeyService } from '../services/api.key.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const apiKeyController = {
    getAll: handle(req => apiKeyService.getAll(qs.parse(req.query))),
    getById: handle(req => apiKeyService.getById(req.params.id)),
    create: handle(req => apiKeyService.create(req.body)),
    createMany: handle(req => apiKeyService.createMany(req.body)),
    upsertMany: handle(req => apiKeyService.upsertMany(req.body)),
    update: handle(req => apiKeyService.update(req.params.id, req.body)),
    remove: handle(req => apiKeyService.remove(req.params.id)),
};