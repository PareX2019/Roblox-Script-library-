const userDB = require('../../db/schemas/user');
const emailValidator = require('email-validator');
const randomStr = require('secure-random-string');
const {
    hash,
    compare
} = require('bcryptjs');
const {
    sendMail
} = require('../mail/index');
const {
    v4: uuidv4
} = require('uuid');
const S3 = require('../../db/controller/aws-s3');
var passwordValidator = require('password-validator');

// Create a schema
var schema = new passwordValidator();

function validatePassword(str) {
    schema
        .is().min(8)
        .has().uppercase()
        .has().lowercase()
        .has().symbols(1)
        .has().digits(2)
        .has().not().spaces()
    return schema.validate(str);
}

function generateToken() {
    return randomStr({
        length: 256
    });
}

/*
 Body:
 password
 username
 email
*/
exports.register = async (req, res, next) => {
    try {
        const imgType = ['png', 'jpg', 'jpeg'];

        if (!emailValidator.validate(req.body.email)) {
            res.status(400);
            throw 'Invalid email.';
        }

        if (req.body.username.length > 12) {
            res.status(400);
            throw 'Username must only contain less than 12 characters';
        }

        if (!validatePassword(req.body.password)) {
            res.status(400);
            throw 'Password must be secure!';
        }

        req.body.username.split('').forEach(c => {
            if (!("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split('').includes(c))) {
                res.status(400);
                throw 'Invalid characters in useranme';
            }

        });

        const userCheck = await userDB.findOne({
            $or: [{
                username: req.body.username,
                email: req.body.email
            }]
        });

        if (userCheck) {
            res.status(409);
            throw 'User with that email or username already exists';
        }

        if (!req.file) {
            res.status(400);
            throw 'No avatar provided.';
        }

        if (req.file.size > 2000) {
            res.status(400);
            throw 'Avatar is too big.';
        }

        if (!imgType.includes(req.file.originalname.split('.').pop())) {
            res.status(400);
            throw 'Avatar has an invalid file type.';
        }

        var avatar = await S3.uploadAvatar(req.files.buffer, `${uuidv4}.${req.file.originalname.split('.').pop()}`);
        if (!avatar) {
            res.status(500);
            throw 'Failed to upload avatar';
        } else {
            avatar = avatar.Key;
        }

        let token = generateToken();

        const user = new userDB({
            username: req.body.username,
            password: await hash(password, 10),
            email: req.body.email,
            token,
            pfp: avatar
        });

        await user.save();

        sendMail({
            to: req.body.email,
            subject: 'Welcome to tonyproject.',
            html: ''
        });

        res.status(201).json({
            error: false,
            message: token
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
}

exports.login = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            username: req.body.username
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }
        var compared = await compare(req.body.password, user.password)
        if (!compared) {
            res.status(401)
            throw 'Unauthorized';
        }

        let tokenCode = user.token;
        if (!user.token) {
            tokenCode = generateToken();
            user.token = tokenCode;
            await user.save();
        }

        res.status(200).json({
            error: false,
            message: tokenCode
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
};

//send reset email
exports.forgotPassword = async (req, res, next) => {
    try {
        const hash = await hash(generateToken(), 5);

        const user = await userDB.findOne({
            email : req.body.email
        });
        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        user.reset_hash = hash;
        await user.save();

        const resetUrl = `http://localhost:3000/reset/${hash}/${user.email}`;

        sendMail({
            to: user.email,
            subject: 'Password Reset | tonyproject',
            html: `${resetUrl}`
        });

        res.status(200).json({
            error: false,
            message: 'Success'
        });

        //expire in 5 minutes
        setTimeout(async () => {
            user.reset_hash = "";
            await user.save();
        }, 300000)
    } catch (ex) {
        next(new Error(ex.message));
    }
}

//reset password
exports.resetPassword = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            email: req.body.email
        });
        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (user.reset_hash !== req.body.token) {
            res.status(440);
            throw 'Session Expired';
        }

        if (!validatePassword(req.body.password)) {
            res.status(400);
            throw 'Password must be secure!';
        }

        user.password = await hash(req.body.password, 10);
        user.reset_hash = "";
        await user.save();

        sendMail({
            to: user.email,
            subject: 'Your password was changed. | tonyproject',
            html: `if you think this was a mistake please reset your password.`
        });

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.verifyEmail = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (user.verifiedEmail) {
            res.status(409);
            throw 'User already verified!';
        }

        user.verifiedEmail = true;
        await user.save();

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.resendVerificationEmail = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (user.verifiedEmail) {
            res.status(409);
            throw 'User already verified!';
        }

        sendMail({
            to: user.email,
            subject: 'Email Verification | tonyproject',
            html: `http://localhost:3000/verify-email/`
        });

        res.status(200).json({
            error: false,
            message: 'Success'
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
};


/*
 Body:
 token = reset token
 email
*/
exports.sendChangeEmail = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (!user.verifiedEmail) {
            res.status(409);
            throw 'Your email must be verified to reset your email.';
        }

        const hash = await hash(generateToken(), 5);
        user.change_email_hash = hash;
        await user.save();

        sendMail({
            to: user.email,
            subject: 'Email Change Request | tonyproject',
            html: `http://localhost:3000/reset-email/`
        });


        setTimeout(async () => {
            user.change_email_hash = "";
            await user.save();
        }, 300000);
    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.logoutALLSESSIONS = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        user.token = "";
        await user.save();

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.resetEmail = async (req, res, next) => {
    try {
        const user = await userDB.findOne({
            token: req.headers.authorization
        });

        if (!user) {
            res.status(404);
            throw 'User not found!';
        }

        if (user.change_email_hash !== req.body.token) {
            res.status(440);
            throw 'Session Expired';
        }

        user.email = req.body.newEmail;
        user.change_email_hash = "";
        await user.save();


        sendMail({
            to: user.oldEmail,
            subject: 'Email has been changed | tonyproject',
            html: `Your email was updated from ${req.body.oldEmail} to ${req.body.newEmail}`
        });

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
};
