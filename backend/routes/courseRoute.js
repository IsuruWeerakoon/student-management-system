const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController.js');
const { authenticateUser, authorizeRoles} = require('../middleware/authMiddleware.js');

// Get all courses (Admin Only)
// uses in AdminExams.jsx, ManageCourses.jsx, 
router.get('/courses', authenticateUser, authorizeRoles('admin'), courseController.getAllCourse);
// Get specific courses for Teacher or Admin
//Used in TeacherExams.jsx (Teacher), ManageCourses.jsx(Admin)
router.get('/courses/:id', authenticateUser, authorizeRoles('admin', 'teacher'), courseController.getCourseByParamID);
// Add new courses (Admin Only)
// ManageCourses.jsx (Admin)
router.post('/courses', authenticateUser, authorizeRoles('admin'), courseController.registerCourse);
// Update existing courses (Admin)
// ManageCourses.jsx (Admin)
router.put('/courses/:id', authenticateUser, authorizeRoles('admin'), courseController.updateCourse);
// Delete courses (Admin Only)
// ManageCourses.jsx (Admin)
router.delete('/courses/:id', authenticateUser, authorizeRoles('admin'), courseController.deleteCourse);




// Get specific courses record for Student Dashboard 
// uses Nowhere
// router.get('/courses/record', authenticateUser, courseController.getCourseByTokenID);
// router.get('/courses/search', authenticateUser, authorizeAdmin, courseController.searchCourse);
//



module.exports = router;