// Middleware/verifyToken.js => VerifyToken.js

const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: 'No token provide, Unauthorized'
        });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'secretKey', (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid token, forbidden'
            });
        }
        req.user = user;
        next();
    });
};

module.exports = verifyToken;