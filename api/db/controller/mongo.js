const mongo = require('mongoose');
mongo.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

module.exports = mongo.connection;