const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware.js');

//send message to the teacher
// StudentDashboard.jsx
router.post('/messages/send', authenticateUser, messageController.sendMessage);

//Get message for the teacher to show in teachers dashboard
// TeacherDashboard.jsx
router.get('/messages/teacher/:teacherId', authenticateUser, authorizeRoles('teacher'), messageController.getMessagesForTeacher);

// TeacherDashboard.jsx
router.post('/messages/reply/:messageId', authenticateUser, authorizeRoles('teacher'), messageController.replyToMessage);

// TeacherDashboard.jsx
router.get('/messages/unread-count/:teacherId', authenticateUser, authorizeRoles('teacher'), messageController.getUnreadCount);

// StudentDashboard.jsx
router.get('/messages/student/:studentId', authenticateUser, messageController.getMessagesForStudent);

module.exports = router;