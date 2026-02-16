import { categoryItemVersionService } from '../services/category.item.version.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryItemVersionController = {
    getAll: handle(req => categoryItemVersionService.getAll(req.user, qs.parse(req.query))),
    getById: handle(req => categoryItemVersionService.getVersionById(req.params.id)),
    createVersion: handle(req => categoryItemVersionService.createVersion(req.user.id, req.body)),
    updateVersion: handle(req => categoryItemVersionService.updateVersion(req.params.id, req.user.id, req.body)),
    deleteVersion: handle(req => categoryItemVersionService.deleteVersion(req.params.id, req.user.id)),
    approveVersion: handle(req => categoryItemVersionService.approveVersion(req.params.id)),
    rejectVersion: handle(req => categoryItemVersionService.rejectVersion(req.params.id, req.body.reject_reason)),
    remove: handle(req => categoryItemVersionService.remove(req.params.id)),
    rollbackVersion: handle(req => categoryItemVersionService.rollbackVersion(req.params.id))
};