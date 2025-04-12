const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController.js');
const { authenticateUser, authorizeTeacher } = require('../middleware/authMiddleware.js');

router.get('/teacher/record', authenticateUser, teacherController.getTeacherData);
// Get courses assigned to teacher
router.get('/teacher/courses/:teacher_id', authenticateUser, teacherController.getTeacherCourses);
// Get exams for a course
router.get('/teacher/exams/:course_id', authenticateUser, teacherController.getCourseExams);
// Get students in a course
router.get('/teacher/students/:course_id', authenticateUser, teacherController.getEnrolledStudents);

router.post('/teacher/exams', authenticateUser, teacherController.addExam);
// Submit results
router.post('/teacher/submit-results', authenticateUser, teacherController.submitResults);

// Courses
router.post('/courses', authenticateUser, teacherController.addCourse);
router.put('/courses/:id', authenticateUser, teacherController.updateCourse);
router.delete('/courses/:id', authenticateUser, teacherController.deleteCourse);

// Exams
router.put('/exams/:id', authenticateUser, teacherController.updateExam);
router.delete('/exams/:id', authenticateUser, teacherController.deleteExam);

router.get('/teacher/timetable/:teacherId', authenticateUser, teacherController.getTeacherTimetable);

router.get('/teachers', authenticateUser, teacherController.getAllTeachers);



module.exports = router;

