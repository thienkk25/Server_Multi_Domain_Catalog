export const errorHandler = (err, req, res, next) => {
    console.log("==== ERROR TYPE ====")
    console.log("constructor:", err?.constructor?.name)
    console.log("instanceof Error:", err instanceof Error)
    console.log("keys:", Object.keys(err || {}))
    console.log("raw:", err)
    console.log("stack:", err?.stack)

    const statusCode = err.status || 500

    return res.status(statusCode).json({
        success: false,
        message: err.message || "Đã có lỗi xảy ra",
        ...(err.errors && { errors: err.errors })
    })
}