module.exports = {
    fatal,
    info
};
const log = require('bunyan').createLogger({ name: 'server' });

function fatal(str) {
    log.fatal(str);
}

function info(str) {
    log.info(str);
}