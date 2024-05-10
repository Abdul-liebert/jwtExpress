const connection = require('../config/connection');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function registerUser(name, email, password, phone) {
    try {
        //step 1: check user existence
        const [existingUsers] = await connection.query('SELECT * FROM user WHERE email =?', [email])
        if (existingUsers.length > 0) {
            throw new error('Email already exist')
            //sign up

        }
        // hash password = a4423jk2323sdsdf
        const hashedPassword = await bcrypt.hash(password, 16)
        const [newUser] = await connection.query('INSERT INTO user  (name, email, password, phone) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, phone])
        return {
            success: true,
            message: 'User created successfully',
            data: { id: newUser.insertId, name, email, phone }
        }
    } catch (error) {
        return { success: false, message: error.message }
    }
}

async function loginUser(email, password) {
    try {
        const [user] = await connection.query('SELECT * FROM user WHERE email = ?', [email]);
        if (user.length === 0) {
            throw new Error('user not found')
        }
        const isPasswordValid = await bcrypt.compare(password, user[0].password);
        if (!isPasswordValid) {
            throw new Error('Invalid Password')
        }
        //generate token
        const createToken = jwt.sign({ email: user[0].email, password: password[0].password }, 'secretKey')
        return { success: true, message: 'Login Successful', createToken };
    } catch (error) {
        console.error(error);
        return { success: 'false', message: error.message }
    }
}

async function getMe(token) {
    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'secretKey')
        const userData = {
            id: decoded.id,
            username: decoded.username,
            email: decoded.email
        }
        return { success: true, message: 'User data retrieved successfully', data: userData }
    } catch (error) {
        console.error(error)
        return { success: false, message: error.message }
    }
}

module.exports = { registerUser, loginUser, getMe };