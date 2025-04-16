const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController.js')
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

//AdminDashboard.jsx
router.get('/admin/record', authenticateUser, authorizeRoles('admin'), adminController.getAdminData);

module.exports = router;
