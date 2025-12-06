export const handle = handler => async (req, res, next) => {
    try {
        const data = await handler(req);
        res.json({ success: true, data });
    } catch (err) {
        next(err);
    }
};