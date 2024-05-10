const { registerUser, loginUser, getMe } = require('../models/authModels');
const { body, validationResult } = require('express-validator');


//register

async function register(req, res) {
    const validations = [
        body('name').notEmpty().withMessage('Username is required'),
        body('email').notEmpty().isEmail().withMessage('Email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        body('phone').notEmpty().withMessage('Phone is required')
    ];

    await Promise.all(validations.map(v => v.run(req)))
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errMsg = errors.array().map(error => ({
            [error.path]: error.msg
        }))
        return res.status(422).json({
            status: false,
            message: 'error validation fields',
            error: errMsg
        })
    }

    const { name, email, password, phone } = req.body;
    try {
        const result = await registerUser(name, email, password, phone);
        if (result.success) {
            res.status(201).json({
                succes: result.success,
                message: result.message,
                data: result.data
            })
        } else {
            res.status(500).json({ error: result.message })
        }
    } catch (error) {
        console.error(error);

    }
}

async function login(req, res) {
    const validations = [
        body('email').notEmpty().withMessage("Email required"),
        body('password').notEmpty().withMessage("Password required")
    ];

    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errMsg = errors.array().map(errors = ({
            [errors.path]: errors.msg
        }));
        return res.status(422).json({ errors: errMsg });
    }

    const { email, password } = req.body;
    try {
        const result = await loginUser(email, password);
        if (result.success) {
            res.status(200).json({
                success: result.success,
                message: result.message,
                token: result.createToken
            })
        } else {
            res.status(401).json({ error: result.message });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

async function me(req, res) {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({
            status: '401 Unauthorized'
        })

        const user = await getMe(token);
        if (user.success) {
            res.status(200).json({
                success: user.success,
                message: user.message,
                data: user.data
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { register, login, me };