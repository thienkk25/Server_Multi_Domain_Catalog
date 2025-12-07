import { legalDocumentService } from '../services/legal.document.service.js'
import { handle } from '../utils/handle.helper.js';

export const legalDocumentController = {
    getAll: handle(req => legalDocumentService.getAll(req.query)),
    getById: handle(req => legalDocumentService.getById(req.params.id)),
    create: handle(req => legalDocumentService.create(req.body)),
    createMany: handle(req => legalDocumentService.createMany(req.body)),
    upsertMany: handle(req => legalDocumentService.upsertMany(req.body)),
    update: handle(req => legalDocumentService.update(req.params.id, req.body)),
    remove: handle(req => legalDocumentService.remove(req.params.id)),
};