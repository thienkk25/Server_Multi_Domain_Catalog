import { legalDocumentService } from '../services/legal.document.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const legalDocumentController = {
    getAll: handle(req => legalDocumentService.getAll(qs.parse(req.query))),
    getById: handle(req => legalDocumentService.getById(req.params.id)),
    create: handle(req => legalDocumentService.create(req.body, req.file)),
    update: handle(req => legalDocumentService.update(req.params.id, req.body, req.file)),
    remove: handle(req => legalDocumentService.remove(req.params.id)),
    getSignedUrl: handle(req => legalDocumentService.getSignedUrl(req.query.file_path || req.query.filePath)),
    getLegalDocumentsWithFile: handle(req => legalDocumentService.getLegalDocumentsWithFile(qs.parse(req.query)))
};
