const mongodb = require('mongoose');

const users = new mongodb.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    pfp: {
        type: String,
        required: false,
        default: "default.png"
    },
    role: {
        type: Number,
        required: false,
        default : 0
        /* 0 = Normal
           1 = Moderator(Delete scripts)
           3 = Administrator(Delete users, scripts)
           4 = Owner(Do anything)
        */
    }
});

module.exports = mongodb.model('users', users);