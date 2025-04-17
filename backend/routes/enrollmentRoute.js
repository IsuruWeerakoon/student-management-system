const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

// Get all courses + enrolled ones //Earlier used in CourseEnrollment.jsx (Admin, Student)
// StudentDashboard.jsx
router.get('/', authenticateUser, enrollmentController.get_All_Course_And_Enrollments);


// Get all students
// ManageEnrollments.jsx (admin)
router.get('/admin/students', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Get_All_Students);
// Get all courses + enrolled courses for a student
// ManageEnrollments.jsx (admin)
router.get('/admin/student-courses/:studentId', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Get_All_Course_And_Enrollments);

// Get all teachers
// ManageEnrollments.jsx (admin)
router.get('/admin/teachers', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Get_All_Teachers);
// Get all courses + enrolled courses for a teachers
// ManageEnrollments.jsx (admin)
router.get('/admin/teacher-courses/:teacherId', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Get_All_Course_And_Teacher_Enrollments);


// Enroll in course //Earlier used in CourseEnrollment.jsx
// StudentDashboard.jsx
router.post('/enroll', authenticateUser, authorizeRoles('admin', 'student'), enrollmentController.student_Enroll);
// Unenroll from course //Earlier used in CourseEnrollment.jsx
// StudentDashboard.jsx
router.post('/unenroll', authenticateUser, authorizeRoles('admin'), enrollmentController.student_Unenroll);

// Enroll a student in a course
// ManageEnrollments.jsx
router.post('/admin/enroll', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Enroll_Student);
// Unenroll a student from a course
// ManageEnrollments.jsx
router.post('/admin/unenroll', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Unenroll_Student);

// Assign teacher in a course
// ManageEnrollments.jsx
router.post('/admin/assign', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Assign_Teacher);
// Unassign teacherfrom a course
// ManageEnrollments.jsx
router.post('/admin/unassign', authenticateUser, authorizeRoles('admin'), enrollmentController.admin_Unassign_Teacher);

module.exports = router;