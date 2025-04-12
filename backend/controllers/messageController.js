const db = require('../dbModel.js');
const messageModel = require('../models/messageModel.js');

exports.sendMessage = function (req, res) {
    const { sender_id, receiver_id, sender_role, message } = req.body;
    messageModel.createMessage(sender_id, receiver_id, sender_role, message, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json({ message: "Message Sent.." });
    });
};

exports.getMessagesForTeacher = function (req, res) {
    const teacherId = req.params.teacherId;
    messageModel.retrieveMessageForTeacher(teacherId, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
};

exports.replyToMessage = function (req, res) {
    const messageId = req.params.messageId;
    const { reply } = req.body;
    messageModel.replyToStudentMessage(messageId, reply, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
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

exports.getMessagesForStudent = function (req, res) {
    const studentId = req.params.studentId;
    messageModel.retrieveMessageForStudent(studentId, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};
