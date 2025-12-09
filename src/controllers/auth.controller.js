import { authService } from '../services/auth.service.js'

const login = async (req, res, next) => {
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

const register = async (req, res, next) => {
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

const signOut = async (req, res, next) => {
    try {
        const result = await authService.signOut();
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        next(err)
    }
}

const refreshToken = async (req, res, next) => {
    try {
        const result = await authService.refreshToken(req.body);
        res.json({
            success: true,
            data: result
        })
    } catch (err) {
        next(err)
    }
}

export const authController = {
    login, register, signOut, refreshToken
}