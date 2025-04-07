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

function authorizeAdmin(req, res, next) {
    if (req.user.userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Only Admins can Perform this Task' });
    }
    next();
}

module.exports = { authenticateUser, authorizeAdmin };