const db = require('../dbModel.js');

const Message = {
    createMessage: function (sender_id, receiver_id, sender_role, message, callback) {
        const sql_query = `
        INSERT INTO messages 
        (sender_id, receiver_id, sender_role, message) 
        VALUES (?, ?, ?, ?)
        `;
        db.query(sql_query, [sender_id, receiver_id, sender_role, message], callback);
    },

    retrieveMessageForTeacher: function (teacherID, callback) {
        const sql_query = `
        SELECT messages.*, students.name AS sender_name 
        FROM messages 
        JOIN students ON messages.sender_id = students.id 
        WHERE messages.receiver_id = ? 
        AND messages.sender_role = 'student' 
        ORDER BY created_at DESC
        `;
        // const sql_update_query = `
        // UPDATE messages 
        // SET is_read = 1 
        // WHERE receiver_id = ? 
        // AND sender_role = 'student'
        // `;
        // db.query(sql_update_query, teacherID);
        db.query(sql_query, [teacherID], callback);
    },

    replyToStudentMessage: function (messageId, teacherID, replyMessage, callback) {
        const sql_query = `UPDATE messages SET reply = ? WHERE id = ?`;
        const sql_update_query = `
        UPDATE messages 
        SET is_read = 1, is_reply = 1 
        WHERE receiver_id = ? 
        AND sender_role = 'student'
        AND id = ?
        `;
        db.query(sql_update_query, [teacherID, messageId]);
        db.query(sql_query, [replyMessage, messageId], callback);
    },

    retrieveUnreadCount: function (teacherID, callback) {
        const sql_query = `
        SELECT COUNT(*) AS unreadCount 
        FROM messages 
        WHERE receiver_id = ? 
        AND sender_role = 'student' 
        AND is_read = 0
        `;
        db.query(sql_query, [teacherID], callback);
    },





    retrieveStudentUnreadCount: function (studentID, callback) {
        const sql_query = `
        SELECT COUNT(*) AS unreadCount 
        FROM messages 
        WHERE sender_id = ? 
        AND sender_role = 'student' 
        AND is_reply = 1 
        AND readStatus = 0 
        `;
        db.query(sql_query, [studentID], callback);
    },




    retrieveMessageForStudent: function (studentId, callback) {
        const sql_query = `
        SELECT messages.*, students.name AS teacher_name 
        FROM messages 
        JOIN students ON messages.receiver_id = students.id 
        WHERE messages.sender_id = ? 
        AND messages.sender_role = 'student' 
        ORDER BY created_at DESC
        `;
        const sql_update_query = `
        UPDATE messages 
        SET readStatus = 1 
        WHERE sender_id = ? AND is_reply = 1
        `;
        db.query(sql_update_query, [studentId]);
        db.query(sql_query, [studentId], callback);
    }
};

module.exports = Message;