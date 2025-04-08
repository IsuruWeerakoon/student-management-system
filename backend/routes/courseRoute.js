const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');

// Get all courses (Admin Only)
router.get('/courses', authenticateUser, courseController.getAllCourse);

// Get specific courses record for Student Dashboard 
router.get('/courses/record', authenticateUser, courseController.getCourseByTokenID);

// Add new courses (Admin Only)
router.post('/courses', authenticateUser, authorizeAdmin, courseController.registerCourse);

// GET /courses/search?query=mark
router.get('/courses/search', authenticateUser, authorizeAdmin, courseController.searchCourse);

// Get specific courses (Admin and Student)
router.get('/courses/:id', authenticateUser, courseController.getCourseByParamID);

// Update existing courses (Both Users)
router.put('/courses/:id', authenticateUser, authorizeAdmin, courseController.updateCourse);

// Delete courses (Admin Only)
router.delete('/courses/:id', authenticateUser, authorizeAdmin, courseController.deleteCourse);

module.exports = router;