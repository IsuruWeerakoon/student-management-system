const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

function authenticateUser(req, res, next) {
    const token = req.cookies.token; // Get token from cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Store user data in request object
        next();
    }
    catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

function authorizeRoles(...allowedRoles) {
    return function (req, res, next) {
        if (!allowedRoles.includes(req.user.userRole)) {
            return res.status(403).json({ message: 'Access denied... You Cannot Perform this Task...' });
        }
        next();
    };
}

module.exports = { authenticateUser, authorizeRoles };