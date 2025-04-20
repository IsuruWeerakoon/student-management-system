const messageModel = require('../models/messageModel.js');
const { io } = require('../server.js');

exports.sendMessage = function (req, res) {
    const { sender_id, receiver_id, sender_role, message } = req.body;
    messageModel.createMessage(sender_id, receiver_id, sender_role, message, function (err, result) {
        if (err) {
            console.log(err);
        }
        io.emit('newMessage');
        res.json({ message: "Message Sent.." });
    });
};

exports.getMessagesForTeacher = function (req, res) {
    const teacherId = req.params.teacherId;
    messageModel.retrieveMessageForTeacher(teacherId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};

exports.replyToMessage = function (req, res) {
    const messageId = req.params.messageId;
    const { reply, teacherID } = req.body;
    messageModel.replyToStudentMessage(messageId, teacherID, reply, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        io.emit('newMessage');
        res.json({ message: 'Reply sent' });
    });
};

exports.getUnreadCount = function (req, res) {
    const teacherId = req.params.teacherId;
    messageModel.retrieveUnreadCount(teacherId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result[0]);
    });
};


exports.getUnreadStudentCount = function (req, res) {
    const studentId = req.params.studentId;
    messageModel.retrieveStudentUnreadCount(studentId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result[0]);
    });
};

exports.getMessagesForStudent = function (req, res) {
    const studentId = req.params.studentId;
    messageModel.retrieveMessageForStudent(studentId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};
