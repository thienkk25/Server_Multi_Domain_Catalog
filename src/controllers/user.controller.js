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
const updatePhone = async (req, res, next) => {
    try {
        const result = await userService.updatePhone(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const updateFullName = async (req, res, next) => {
    try {
        const result = await userService.updateFullName(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    changePassword, updateFullName, updatePhone
}