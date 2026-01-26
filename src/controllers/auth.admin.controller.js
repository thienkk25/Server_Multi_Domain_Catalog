import { authAdminService } from "../services/auth.admin.service.js"
import qs from "qs"

const getAll = async (req, res, next) => {
    try {
        const result = await authAdminService.getAll(qs.parse(req.query))
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }

}

const getById = async (req, res, next) => {
    try {
        const result = await authAdminService.getById(req.params.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const result = await authAdminService.create(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const { id } = req.params

        const result = await authAdminService.update({
            id,
            password: req.body.password,
            user_metadata: req.body.user_metadata,
        })

        res.json({
            success: true,
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await authAdminService.remove(req.params.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const activateUser = async (req, res, next) => {
    try {
        const result = await authAdminService.activateUser(req.params.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const deactivateUser = async (req, res, next) => {
    try {
        const result = await authAdminService.deactivateUser(req.params.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const grantUserAccess = async (req, res, next) => {
    try {
        const { user_id, role_id, domain_ids } = req.body
        const result = await authAdminService.grantUserAccess(user_id, role_id, domain_ids)

        res.json({ success: true, data: result })
    } catch (error) {
        next(error)
    }
}

export const authAdminController = {
    getAll, getById, create, update, remove, activateUser, deactivateUser, grantUserAccess
}