import { userService } from '../services/user.service.js'

const changePassword = async (req, res, next) => {
    try {
        const result = await userService.changePassword(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const updateProfile = async (req, res, next) => {
    try {
        const result = await userService.updateProfile(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const me = async (req, res, next) => {
    try {
        const result = await userService.me()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const getProfile = async (req, res, next) => {
    try {
        const result = await userService.getProfile()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const role = async (req, res, next) => {
    try {
        const result = await userService.role(req.user.id)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    changePassword, updateProfile, me, getProfile, role
}