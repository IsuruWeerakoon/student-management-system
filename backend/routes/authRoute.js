const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');

// Login Route
router.post('/login', authController.userLogin);
// Get logged-in user (for checking authentication)
router.get('/user', authController.userVerification);
//Logout
router.post('/logout', authController.userLogout);

module.exports = router;