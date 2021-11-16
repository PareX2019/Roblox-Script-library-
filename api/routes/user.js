const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const {
    Auth
} = require('../base/routes/main');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
});

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

router.post('/login', limit, Auth.login)
router.post('/register', [limit, upload.single('file')], Auth.register)
router.post('forgot-password', limit, Auth.forgotPassword)
router.patch('/reset-password', Auth.resetPassword)

module.exports = router;