const middleware = require('../middleware/main');

module.exports = (app) => {
    app.use('/public', require('./public'));
    app.use('/user', require('./user'));
    app.use('/auth', [middleware.isLoggedIn], require('./auth'));
    app.use('/script', [middleware.isLoggedIn], require('./script'));
    app.use('/moderation', [middleware.isLoggedIn, middleware.isScriptEditor], require('./moderation'));
};