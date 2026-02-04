import { categoryItemVersionService } from '../services/category.item.version.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryItemVersionController = {
    getAll: handle(req => categoryItemVersionService.getAll(qs.parse(req.query))),
    getById: handle(req => categoryItemVersionService.getById(req.params.id)),
    createVersion: handle(req => categoryItemVersionService.createVersion(req.body)),
    updateVersion: handle(req => categoryItemVersionService.updateVersion(req.params.id, req.body)),
    deleteVersion: handle(req => categoryItemVersionService.deleteVersion(req.params.id)),
    approveVersion: handle(req => categoryItemVersionService.approveVersion(req.params.id)),
    rejectVersion: handle(req => categoryItemVersionService.rejectVersion(req.params.id, req.body.reject_reason)),
    remove: handle(req => categoryItemVersionService.remove(req.params.id)),
};