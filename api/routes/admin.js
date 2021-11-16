const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { Admin } = require('../base/routes/main');

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

router.delete('/user/:id', limit, Admin.deleteuser);
router.get('/user/:id', Admin.getuserinfo);


module.exports = router;