const express = require('express')
const router = express.Router();

const { register, login, me, logout } = require('../Controllers/AuthControllers');
const verifyToken = require('../middleware/VerifyToken');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);
router.post('/logout', verifyToken, logout);



module.exports = router;