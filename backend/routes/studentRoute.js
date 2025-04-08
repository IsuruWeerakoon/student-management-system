const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/fileMiddleware.js');

// Get all students (Admin Only)
router.get('/students', authenticateUser, authorizeAdmin, studentController.getAllStudents);

// Get specific students record for Student Dashboard 
router.get('/students/record', authenticateUser, studentController.getStudent_StudentDashboard);

// Add new student (Admin Only)
router.post('/students', authenticateUser, authorizeAdmin, upload, studentController.registerStudent);

// GET /students/search?query=mark
router.get('/students/search', authenticateUser, authorizeAdmin, studentController.searchStudents);

// Get specific students (Admin and Student)
router.get('/students/:id', authenticateUser, studentController.getSpecificStudent);

// Update existing student (Both Users)
router.put('/students/:id', authenticateUser, upload, studentController.updateStudent);

// Update existing student user account details(Both Can)
router.post('/students/account/:id', authenticateUser, studentController.updateAccountDetails);

// Delete student (Admin Only)
router.delete('/students/:id', authenticateUser, authorizeAdmin, studentController.deleteStudent);

module.exports = router;