const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');

// Admin: Get all exams
router.get('/', authenticateUser, authorizeAdmin, examController.getAllExams);

// Admin: Create exam
router.post('/', authenticateUser, examController.registerExam);

// Admin: Update exam
router.put('/:examId', authenticateUser, examController.updateExam);

// Student: View exams for their enrolled courses
router.get('/studentdata', authenticateUser, examController.getExamsForStudents);

router.get('/:id', authenticateUser, examController.getExamsForCourse);

router.delete('/:examId', authenticateUser, examController.deleteExamsUsingID);

module.exports = router;