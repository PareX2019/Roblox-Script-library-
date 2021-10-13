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

        let token = generateToken();

        const user = new userDB({
            username: req.body.username,
            password: await hash(password, 10),
            email: req.body.email,
            token
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

        if (!await compare(req.body.password, user.password)) {
            res.status(401)
            throw 'Unauthorized';
        }

        let tokenCode = generateToken();

        user.token = tokenCode;
        await user.save();



        res.status(200).json({
            error: false,
            message: tokenCode
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
};

exports.sendResetEmail = async (req, res, next) => {
    try {
        let hash = generateToken();

        const user = await userDB.findOne({
            email: req.body.email
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

exports.validateResetToken = async (req, res, next) => {
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

        res.status(200).json({
            error: false,
            message: 'Success'
        });

    } catch (ex) {
        next(new Error(ex.message));
    }
}

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

        res.status(200).json({
            error: false,
            message: 'Success'
        });
    } catch (ex) {
        next(new Error(ex.message));
    }
};