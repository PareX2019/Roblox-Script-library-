const users = require('../db/schemas/user');

module.exports = async (req, res, next) => {
    try {
        const user = await users.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(401);
            throw Error('Unauthorized');
        }

        if (user.role < 1) {
            res.status(401);
            throw Error('Unauthorized');
        }

        next();
    } catch (e) {
        next(new Error(e.message));
    }
}