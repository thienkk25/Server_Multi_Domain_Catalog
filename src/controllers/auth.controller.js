
import { authService } from '../services/auth.service.js'


const loginController = async (req, res, next) => {
    try {
        const result = await authService.signInWithPassword(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        next(err)
    }
}

const registerController = async (req, res, next) => {
    try {
        const result = await authService.register(req.body)
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        next(err)
    }
}

const signOutController = async (req, res, next) => {
    try {
        const result = await authService.signOut();
        res.json({
            success: true,
            data: result
        });
    } catch (err) {
        next(err);
    }
}

export const authController = {
    loginController, registerController, signOutController
}