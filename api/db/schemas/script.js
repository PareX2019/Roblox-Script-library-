const mongodb = require('mongoose');

const scripts = new mongodb.Schema({
    owner: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    script : {
        type: String,
        required : true
    },
    tags: {
        type: Array,
        required: false
    },
    thubnail : {
        type: String,
        required : true
    },
    rank: {
        type: Number,
        required: false,
        default : 0
        /* 0 = Normal
           1 = Verified
           2 = Advertise
        */
    }
});

module.exports = mongodb.model('scripts', scripts);