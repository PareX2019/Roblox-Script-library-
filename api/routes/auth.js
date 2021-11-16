const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const {
    Auth
} = require('../base/routes/main');

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

router.post('/logout', Auth.logoutALLSESSIONS)
//reset password

//verify email
router.patch('/verify-email', Auth.verifyEmail)
router.post('/resend-verification-email', limit, Auth.resendVerificationEmail)

//reset email
router.post('/change-email', limit, Auth.sendChangeEmail)
router.patch('/reset-email', Auth.resetEmail)

module.exports = router;