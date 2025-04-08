const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultController.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');

// Admin: View all results
router.get('/',authenticateUser, authorizeAdmin, resultsController.getAllResults);

// Admin: Add or update result
router.post('/',authenticateUser, authorizeAdmin, resultsController.addOrUpdateResults);

// Student: View own results
router.get('/student', authenticateUser, resultsController.getStudentResults);

// Get enrolled courses by student ID
router.get('/enrolled-courses/:studentId', resultsController.getEnrolledCourseByStudentID);

// Get existing result (auto-fill)
router.get('/existing/:studentId/:examId', resultsController.getExistingResults);

module.exports = router;