import { apiKeyService } from '../services/api.key.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const apiKeyController = {
    getAll: handle(req => apiKeyService.getAll(qs.parse(req.query))),
    getById: handle(req => apiKeyService.getById(req.params.id)),
    create: handle(req => apiKeyService.create(req.body)),
    revoke: handle(req => apiKeyService.revoke(req.params.id)),
    remove: handle(req => apiKeyService.remove(req.params.id)),
};