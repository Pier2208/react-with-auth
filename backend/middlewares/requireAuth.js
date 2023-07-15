require('dotenv').config();
const jwt = require('jsonwebtoken')
const ApiError = require("../utils/ApiError.class");

const requireAuth = (req, res, next) => {
    // get access token
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    if (!authHeader) throw new ApiError('401', 'You are not authorized');

    const token = authHeader.split(' ')[1];

    // verify access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.sendStatus(403)
        };
        req.user = { email: decoded.email, isAuth: true }
        next()
    });
}

module.exports = requireAuth
