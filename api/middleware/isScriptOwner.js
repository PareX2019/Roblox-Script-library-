const users = require('../db/schemas/user');
const scripts = require('../db/schemas/script');

module.exports = async (req, res, next) => {
    try {
        const user = await users.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(401);
            throw Error('Unauthorized');
        }

        const script = scripts.findOne({ _id: req.headers.scriptid })

        if(!script){
            res.status(404)
            throw Error(`Script with the ID of ${req.headers.scriptid} was not found.`);
        }

        if(script.owner != user.username){
            {
                res.status(401);
                throw Error('Unauthorized');
            }
        }

        next();
    } catch (e) {
        next(new Error(e.message));
    }
}