const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

// Admin: Get all exams
// AdminExams.jsx, AdminResults.jsx
router.get('/exams', authenticateUser, authorizeRoles('admin'), examController.getAllExams);
// Create exam
// AdminExams.jsx, TeacherExams.jsx
router.post('/exams', authenticateUser, authorizeRoles('admin', 'teacher'), examController.registerExam);
// Update exam
// AdminExams.jsx, TeacherExams.jsx
router.put('/exams/:examId', authenticateUser, authorizeRoles('admin', 'teacher'), examController.updateExam);
// Student: View exams for their enrolled courses
//StudentDashboard.jsx
router.get('/exams/studentdata', authenticateUser, authorizeRoles('student'), examController.getExamsForStudents);
//TeacherExams.jsx
router.get('/exams/:id', authenticateUser, authorizeRoles('teacher'), examController.getExamsForCourse);
// Delete exam
// AdminExams.jsx, TeacherExams.jsx
router.delete('/exams/:examId', authenticateUser, authorizeRoles('admin', 'teacher'), examController.deleteExamsUsingID);




// // Admin: Get all exams
// // AdminExams.jsx, AdminResults.jsx
// router.get('/', authenticateUser, authorizeRoles('admin'), examController.getAllExams);
// // Create exam
// // AdminExams.jsx, TeacherExams.jsx
// router.post('/', authenticateUser, authorizeRoles('admin', 'teacher'), examController.registerExam);
// // Update exam
// // AdminExams.jsx, TeacherExams.jsx
// router.put('/:examId', authenticateUser, authorizeRoles('admin', 'teacher'), examController.updateExam);
// // Student: View exams for their enrolled courses
// //StudentDashboard.jsx
// router.get('/studentdata', authenticateUser, authorizeRoles('student'), examController.getExamsForStudents);
// //TeacherExams.jsx
// router.get('/:id', authenticateUser, authorizeRoles('teacher'), examController.getExamsForCourse);
// // Delete exam
// // AdminExams.jsx, TeacherExams.jsx
// router.delete('/:examId', authenticateUser, authorizeRoles('admin', 'teacher'), examController.deleteExamsUsingID);


module.exports = router;