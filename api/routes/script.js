const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const { Script } = require('../base/routes/main');
const multer = require('multer');
const upload = multer({storage: multer.memoryStorage()});

const limit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        status: 429,
        message: 'Too many requests, please try again later.'
    }
});

const scriptUpload = upload.fields([{name: 'script', maxCount: 1}, {name: 'thubnail', maxCount: 1}]);

router.post('/upload', [limit, scriptUpload], Script.upload);


module.exports = router;