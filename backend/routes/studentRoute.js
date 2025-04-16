const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');
const upload = require('../middleware/fileMiddleware.js');

// Get all students (Admin Only)
// ManageStudent.jsx, AdminResult.jsx
router.get('/students', authenticateUser, authorizeRoles('admin'), studentController.getAllStudents);
// Get specific students record for Student Dashboard 
// StudentDashboard.jsx
router.get('/students/record', authenticateUser, studentController.getStudent_StudentDashboard);
// Add new student (Admin Only)
// StudentRegister.jsx
router.post('/students', authenticateUser, authorizeRoles('admin'), upload, studentController.registerStudent);

// Get specific students (Student) 
// ManageStudents.jsx 
router.get('/students/:id', authenticateUser, authorizeRoles('admin'), studentController.getSpecificStudent);

// Update existing student
// StudentDashboard.jsx, TeacherDashboard.jsx, AdminDashboard.jsx, ManageStudents.jsx
router.put('/students/:id', authenticateUser, upload, studentController.updateStudent);

// Update existing student user account details
// StudentDashboard.jsx, TeacherDashboard.jsx, AdminDashboard.jsx
router.post('/students/account/:id', authenticateUser, studentController.updateAccountDetails);


// Delete student (Admin Only)
// ManageStudents.jsx
router.delete('/students/:id', authenticateUser, authorizeRoles('admin'), studentController.deleteStudent);

// GET /students/search?query=mark
// router.get('/students/search', authenticateUser, authorizeAdmin, studentController.searchStudents);

module.exports = router;