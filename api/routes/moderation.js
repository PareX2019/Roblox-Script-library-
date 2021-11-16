const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { Script } = require('../base/routes/main');

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

router.delete('/:id', limit,Script.delete)
router.patch('/:id', limit, Script.edit)

module.exports = router;