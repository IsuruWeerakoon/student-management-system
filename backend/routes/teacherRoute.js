const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

//TeacherDashboard.jsx
router.get('/teacher/record', authenticateUser, authorizeRoles('teacher'), teacherController.getTeacherData);
// Get courses assigned to teacher
//TimetableForm.jsx, TeacherDashboard.jsx
router.get('/teacher/courses/:teacher_id', authenticateUser, authorizeRoles('teacher','admin'), teacherController.getTeacherCourses);
// Get students in a course
// TeacherExams.jsx, TeacherDashboard.jsx
router.get('/teacher/students/:course_id', authenticateUser, authorizeRoles('teacher'), teacherController.getEnrolledStudents);
//TeacherDashboard.jsx
router.get('/teacher/timetable/:teacherId', authenticateUser, authorizeRoles('teacher'), teacherController.getTeacherTimetable);
// AdminTimetable.jsx, StudentDashboard.jsx
router.get('/teachers', authenticateUser, teacherController.getAllTeachers);

module.exports = router;
