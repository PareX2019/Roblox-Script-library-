const mongo = require('mongoose');
mongo.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    require('../../base/logger').info(`Connected to mongo`);
})

module.exports = mongo.connection;