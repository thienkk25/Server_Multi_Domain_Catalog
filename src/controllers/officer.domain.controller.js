import { officerDomainService } from '../services/officer.domain.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const officerDomainController = {
    getAll: handle(req => officerDomainService.getAll(qs.parse(req.query))),
    getById: handle(req => officerDomainService.getById(req.params.id)),
    create: handle(req => officerDomainService.create(req.body)),
    createMany: handle(req => officerDomainService.createMany(req.body)),
    upsertMany: handle(req => officerDomainService.upsertMany(req.body)),
    update: handle(req => officerDomainService.update(req.params.id, req.body)),
    remove: handle(req => officerDomainService.remove(req.params.id)),
};