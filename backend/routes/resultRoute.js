const express = require('express');
const router = express.Router();
const resultsController = require('../controllers/resultController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

// Admin: View all results
//AdminResults.jsx
router.get('/results', authenticateUser, authorizeRoles('admin'), resultsController.getAllResults);

// Admin: Add or update result
//AdminResults.jsx
router.post('/results', authenticateUser, authorizeRoles('admin'), resultsController.addOrUpdateResults);

// TeacherExams.jsx
router.post('/results/submit-results', authenticateUser, authorizeRoles('teacher'), resultsController.submitOrUpdateResults);

// Student: View own results
// StudentDashboard.jsx
router.get('/results/student', authenticateUser, resultsController.getStudentResults);

// GET /api/teacher/existing/exam/:examId
// TeacherExams.jsx
router.get('/results/existing/exam/:examId', authenticateUser, authorizeRoles('teacher'), resultsController.getAllExistingResults);

// Get enrolled courses by student ID
//AdminResults.jsx
router.get('/results/enrolled-courses/:studentId', authenticateUser, authorizeRoles('admin'), resultsController.getEnrolledCourseByStudentID);

// Get existing result (auto-fill)
//AdminResults.jsx
router.get('/results/existing/:studentId/:examId', authenticateUser, authorizeRoles('admin'), resultsController.getExistingResults);


// // Admin: View all results
// //AdminResults.jsx
// router.get('/', authenticateUser, authorizeRoles('admin'), resultsController.getAllResults);

// // Admin: Add or update result
// //AdminResults.jsx
// router.post('/', authenticateUser, authorizeRoles('admin'), resultsController.addOrUpdateResults);

// // TeacherExams.jsx
// router.post('/submit-results', authenticateUser, authorizeRoles('teacher'), resultsController.submitOrUpdateResults);

// // Student: View own results
// // StudentDashboard.jsx
// router.get('/student', authenticateUser, resultsController.getStudentResults);

// // GET /api/teacher/existing/exam/:examId
// // TeacherExams.jsx
// router.get('/existing/exam/:examId', authenticateUser, authorizeRoles('teacher'), resultsController.getAllExistingResults);

// // Get enrolled courses by student ID
// //AdminResults.jsx
// router.get('/enrolled-courses/:studentId', authenticateUser, authorizeRoles('admin'), resultsController.getEnrolledCourseByStudentID);

// // Get existing result (auto-fill)
// //AdminResults.jsx
// router.get('/existing/:studentId/:examId', authenticateUser, authorizeRoles('admin'), resultsController.getExistingResults);

module.exports = router;