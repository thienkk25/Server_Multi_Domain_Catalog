export const errorHandler = (err, req, res, next) => {
    console.error(err)

    const statusCode = err.status || 500

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Đã có lỗi xảy ra",
        ...(err.errors && { errors: err.errors })
    })
}