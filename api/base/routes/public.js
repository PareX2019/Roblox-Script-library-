const users = require('../../db/schemas/user');
const scripts = require('../../db/schemas/script');

exports.scripts = async (req, req, next) => {
    try {
        if (req.params.id) {
            const script = await scripts.findById(req.params.id);
            if (!script) {
                res.status(404);
                throw 'Script not found!';
            }
            return res.status(200).json(script);
        }
        let _scripts = null;
        let limit = 0;
        let rank = 0;

        if (req.query.limit) {
            if (!isNaN(req.query.limit)) {
                res.status(400);
                throw 'Limit must be a number!';
            }
            if (Number(req.query.limit) != 0) {
                limit = Number(req.query.limit);
            }

        }

        if (req.query.rank) {
            if (!isNaN(req.query.rank)) {
                res.status(400);
                throw 'Rank must be a number!';
            }
            rank = Number(req.query.rank);
        }


        if (req.query.search) {
            _scripts = limit == 0 ? await scripts.find({
                $text: {
                    $search: req.query.search
                },
                rank
            }) : await scripts.find({
                $text: {
                    $search: req.query.search
                },
                rank
            }).limit(limit);
        } else {
            _scripts = limit == 0 ? await scripts.find({
                rank
            }) : await scripts.find({
                rank
            }).limit(limit);
        }

        res.status(200).json(_scripts);
    } catch (ex) {
        next(new Error(ex.message));
    }
}

exports.users = async(req,res,next) => {
    try {
        if (req.params.id) {
            const script = await scripts.findById(req.params.id);
            if (!script) {
                res.status(404);
                throw 'Script not found!';
            }
            return res.status(200).json(script);
        }
        let _users = null;
        let limit = 0;
        let rank = 0;

        if (req.query.limit) {
            if (!isNaN(req.query.limit)) {
                res.status(400);
                throw 'Limit must be a number!';
            }
            if (Number(req.query.limit) != 0) {
                limit = Number(req.query.limit);
            }

        }

        if (req.query.rank) {
            if (!isNaN(req.query.rank)) {
                res.status(400);
                throw 'Rank must be a number!';
            }
            rank = Number(req.query.rank);
        }


        if (req.query.search) {
            _users = limit == 0 ? await scripts.find({
                $text: {
                    $search: req.query.search
                },
                rank
            }) : await scripts.find({
                $text: {
                    $search: req.query.search
                },
                rank
            }).limit(limit);
        } else {
            _users = limit == 0 ? await scripts.find({
                rank
            }) : await scripts.find({
                rank
            }).limit(limit);
        }

        res.status(200).json(_users);
    } catch (ex) {
        next(new Error(ex.message));
    }
}