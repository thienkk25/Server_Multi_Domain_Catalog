import { domainService } from '../services/domain.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const domainController = {
    getAll: handle(req => domainService.getAll(qs.parse(req.query), req.role)),
    getById: handle(req => domainService.getById(req.params.id, req.role)),
    create: handle(req => domainService.create(req.body)),
    update: handle(req => domainService.update(req.params.id, req.body)),
    remove: handle(req => domainService.remove(req.params.id)),
    lookup: handle(req => domainService.lookup(req.role)),
};