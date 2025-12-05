export const validateMiddleware = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (err) {
        const errorMessages = JSON.parse(err).map(error => ({
            field: error.path.join('.'),
            message: error.message
        }));

        const validationError = new Error('Xác thực không thành công');
        validationError.status = 400;
        validationError.errors = errorMessages;

        next(validationError)
    }
}