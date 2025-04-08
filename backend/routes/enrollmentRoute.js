const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController.js');
const {authenticateUser, authorizeAdmin} = require('../middleware/authMiddleware.js');

//Routes for Students to get enrolled in courses
// Get all courses + enrolled ones
router.get('/', authenticateUser, enrollmentController.get_All_Course_And_Enrollments);

// Enroll in course
router.post('/enroll', authenticateUser, enrollmentController.student_Enroll);

// Unenroll from course
router.post('/unenroll', authenticateUser, authorizeAdmin, enrollmentController.student_Unenroll);

// Routes for Admins to Enroll Students in Courses
// Get all students
router.get('/admin/students', authenticateUser, authorizeAdmin, enrollmentController.admin_Get_All_Students);

// Get all courses + enrolled courses for a student
router.get('/admin/student-courses/:studentId', authenticateUser, authorizeAdmin, enrollmentController.admin_Get_All_Course_And_Enrollments);

// Enroll a student in a course
router.post('/admin/enroll', authenticateUser, authorizeAdmin, enrollmentController.admin_Enroll_Student);

// Unenroll a student from a course
router.post('/admin/unenroll', authenticateUser, authorizeAdmin, enrollmentController.admin_Unenroll_Student);

module.exports = router;