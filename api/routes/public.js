const router = require('express').Router();
const { Public } = require('../base/routes/main');

router.get('/scripts/:id', Public.scripts)
router.get('/users/:id', Public.users)


module.exports = router;