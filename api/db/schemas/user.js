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
    reset_hash : {
       type: String,
       required: false
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
    token: {
        type:String,
        required: true
    },
    role: {
        type: Number,
        required: false,
        default : 0
        /* 0 = Normal
           1 = Moderator(Delete scripts)
           2 = Administrator(Delete users, scripts)
           3 = Owner(Do anything)
        */
    },
    verifiedEmail: {
        type: Boolean,
        required: false,
        default: false  
    }
});

module.exports = mongodb.model('users', users);