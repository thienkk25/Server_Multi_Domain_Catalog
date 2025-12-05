import { z } from "zod"

const changePasswordUserSchema = z.object({
    new_password: z
        .string()
        .min(6, "Mật khẩu phải ít nhất 6 ký tự")
        .max(50, "Mật khẩu quá dài")
})
const updatePhoneUserSchema = z.object({
    new_phone: z
        .string()
        .regex(/^(0[0-9]{9}|\+84[0-9]{9})$/
            , "Số điện thoại không hợp lệ")
})

const updateFullNameUserSchema = z.object({
    full_name: z.string().min(1, "Tên không được để trống")
})

export const userValidation = {
    changePasswordUserSchema, updatePhoneUserSchema, updateFullNameUserSchema
}