import { userService } from '../services/user.service.js'

const changePasswordUserController = async (req, res, next) => {
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
const updatePhoneUserController = async (req, res, next) => {
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
const updateFullNameUserController = async (req, res, next) => {
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
    changePasswordUserController, updateFullNameUserController, updatePhoneUserController
}