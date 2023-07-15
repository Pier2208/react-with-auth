const router = require('express').Router()
const requireAuth = require('../middlewares/requireAuth');
const ApiError = require('../utils/ApiError.class')

// GET api/v1/user/me
router.get('/me', requireAuth, async (req, res, next) => {
    try {
        const { email, isAuth } = req.user
        res.status(200).json({ email, isAuth })
    } catch (err) {
        next(err)
    }
});

module.exports = router