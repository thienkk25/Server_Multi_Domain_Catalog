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

const getProfile = async (req, res, next) => {
    try {
        const result = await userService.getProfile(req.user.id)
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
        const result = await userService.role()
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    changePassword, updateProfile, getProfile, role
}