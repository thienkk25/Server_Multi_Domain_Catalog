import { z } from "zod"
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phoneRegex = /^(0[0-9]{9}|\+84[0-9]{9})$/

const signInWithPassword = z.object({
    email: z
        .string()
        .regex(emailRegex, "Email không hợp lệ"),

    password: z
        .string()
        .min(6, "Mật khẩu phải tối thiểu 6 ký tự")
})

const register = z.object({
    full_name: z
        .string()
        .min(2, "Tên quá ngắn")
        .max(50, "Tên quá dài"),

    email: z
        .string()
        .regex(emailRegex, "Email không hợp lệ"),

    password: z
        .string()
        .min(6, "Mật khẩu phải tối thiểu 6 ký tự"),

    phone: z
        .string()
        .regex(phoneRegex, "Số điện thoại không hợp lệ")
})

export const authValidationSchema = {
    signInWithPassword, register
}