const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController.js');
const {authenticateUser} = require('../middleware/authMiddleware.js');

//send message to the teacher
router.post('/messages/send',authenticateUser, messageController.sendMessage);
//Get message for the teacher to show in teachers dashboard
router.get('/messages/teacher/:teacherId',authenticateUser, messageController.getMessagesForTeacher);

router.post('/messages/reply/:messageId',authenticateUser, messageController.replyToMessage);

router.get('/messages/unread-count/:teacherId',authenticateUser, messageController.getUnreadCount);

router.get('/messages/student/:studentId',authenticateUser, messageController.getMessagesForStudent);

module.exports = router;