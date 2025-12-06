import { userService } from '../services/user.service.js'

const changePasswordUser = async (req, res, next) => {
    try {
        const result = await userService.changePasswordUser(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const updatePhoneUser = async (req, res, next) => {
    try {
        const result = await userService.updatePhoneUser(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}
const updateFullNameUser = async (req, res, next) => {
    try {
        const result = await userService.updateFullNameUser(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export const userController = {
    changePasswordUser, updateFullNameUser, updatePhoneUser
}