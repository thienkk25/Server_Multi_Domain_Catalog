import { categoryItemVersionService } from '../services/category.item.version.service.js'
import { handle } from '../utils/handle.helper.js'
import qs from "qs"

export const categoryItemVersionController = {
    getAll: handle(req => categoryItemVersionService.getAll(qs.parse(req.query), req.user.id, req.role)),
    getById: handle(req => categoryItemVersionService.getVersionById(req.params.id, req.user.id, req.role)),
    createVersion: handle(req => categoryItemVersionService.createVersion(req.user.id, req.role, req.body)),
    updateVersion: handle(req => categoryItemVersionService.updateVersion(req.params.id, req.role, req.user.id, req.role, req.body)),
    deleteVersion: handle(req => categoryItemVersionService.deleteVersion(req.params.id, req.user.id, req.role)),
    approveVersion: handle(req => categoryItemVersionService.approveVersion(req.params.id, req.user.id, req.role)),
    rejectVersion: handle(req => categoryItemVersionService.rejectVersion(req.params.id, req.body.reject_reason, req.user.id, req.role)),
    remove: handle(req => categoryItemVersionService.remove(req.params.id, req.role)),
    rollbackVersion: handle(req => categoryItemVersionService.rollbackVersion(req.params.id, req.user.id, req.role))
};