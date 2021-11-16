const users = require('../../db/schemas/user');
const scripts = require('../../db/schemas/script');
const S3 = require('../../db/controller/main').cdn;
const {
    v4: uuidv4
} = require('uuid');
const filter = require('leo-profanity');;

exports.upload = (req, res) => {
    try {

        const imgType = ['png', 'jpg', 'jpeg'];
        const scriptType = ['lua', 'txt'];
        const {
            name,
            description,
            tags,
            owner
        } = req.body;

        const user = await users.findOne({
            username: owner
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (!user.verifiedEmail) {
            res.status(404);
            throw 'Please verify your email before trying to upload';
        }

        if (!name || !description) {
            res.status(400);
            throw 'No name or description provided.';
        }

        if (name.length > 30) {
            res.status(400);
            throw 'Script name must be less than 30 characters.';
        }

        if (description.length > 100) {
            res.status(400);
            throw 'Script description must be less than 100 characters.';
        }

        if (filter.check(description) || filter.check(name)) {
            res.status(400);
            throw 'Inappropriate word detected in name or description.';
        }

        if (tags.length > 15) {
            res.status(400);
            throw 'Your only allowed to have 15 tags with in each script.';
        }

        let tagsErr = false;
        tags.forEach(tag => {
            if (tag.length > 15) {
                tagsErr = true;
            } else if (filter.check(tag)) {
                tagsErr = true;
            }
        });

        if (tagsErr) {
            res.status(400);
            throw 'Tags length must be less than 15 characters and they must not contain inappropriate words.';
        }

        if (!req.files['thubnail'][0] || !req.files['script'][0]) {
            res.status(400);
            throw 'No thubnail or script.';
        }

        if (req.files['thubnail'][0].size > 20000 || req.files['script'][0].size > 900000) {
            res.status(400);
            throw 'Image or Script size is too big.';
        }

        if (!imgType.includes(req.files['thubnail'][0].originalname.split('.').pop()) || scriptType.includes(req.files['script'][0].originalname.split('.').pop())) {
            res.status(400);
            throw 'Image or Script has an invalid file type.';
        }

        var thubnail = await S3.uploadThubnail(req.files['thubnail'][0].buffer, `${uuidv4()}.${req.files['thubnail'][0].originalname.split('.').pop()}`);
        if (!thubnail) {
            res.status(500);
            throw 'Failed to upload thubnail.';
        } else {
            thubnail = thubnail.Key;
        }

        var script = await S3.uploadScript(req.files['script'][0].buffer, `${uuidv4}.${req.files['script'][0].originalname.split('.').pop()}`)
        if (!script) {
            res.status(500);
            throw 'Failed to upload script.';
        } else {
            script = script.Key;
        }

        const scriptCreation = scripts({
            owner: user.username,
            name,
            description,
            tags,
            script,
            thubnail
        });
        await scriptCreation.save();

        res.status(201).json(scriptCreation);

    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.delete = async (req, res, next) => {
    try {
        const objID = req.params.id;

        const script = scripts.findById(objID);

        if (!script) {
            res.status(404);
            throw `Script with an ID of ${objID} can not be found.`;
        }

        await script.remove();

        res.status(200).json({
            error: false,
            message: 'Deleted script'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
}

exports.edit = async(req,res,next) => {
    try {
        const objID = req.params.id;
        const { name , description } = req.body;

        const script = scripts.findById(objID);

        if (!script) {
            res.status(404);
            throw `Script with an ID of ${objID} can not be found.`;
        }
        script.name = name;
        script.description = description;

        await script.save();

        res.status(200).json(script);
    } catch (ex) {
        next(new Error(ex.message));
    }
}