const AuthModel = require('../models/authModel.js');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const bcrypt = require('bcryptjs');
env.config();

// Login Controller
exports.userLogin = function (req, res) {
    const { email, password } = req.body;
    AuthModel.userLogin(email, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        if (data.length === 0) {
            return res.status(401).json({ message: 'Invalid Email Address' });
        }
        const user = data[0];
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) {
                return res.status(500).json(err);
            }
            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid Password' });
            }
            const token = jwt.sign({ userID: user.id, userRole: user.role }, process.env.SECRET_KEY, { expiresIn: '8h' });
            res.cookie('token', token, { httpOnly: true, secure: false });
            res.json({ message: 'Login successful' });
        });
    });
};

// User Verification Contoller
exports.userVerification = function (req, res) {
    const userRole = req.user.userRole;
    if (!userRole) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ role: userRole });
};

//User Logout Controller
exports.userLogout= async function (req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (err) {
        console.error('Logout failed:', err);
        res.status(500).json({ message: 'Failed to log out' });
    }
};