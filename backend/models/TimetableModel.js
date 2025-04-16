const db = require('../dbModel.js');

const TimetableModel = {
    getByTeacherId: function (teacherId, callback) {
        const sql = `
        SELECT tt.*, c.course_name 
        FROM timetable tt 
        JOIN courses c ON tt.course_id = c.id 
        WHERE teacher_id = ? 
        ORDER BY tt.day_of_week ASC
        `;
        db.query(sql, [teacherId], callback);
    },

    checkForInsert: function (teacher_id, course_id, day_of_week, start_time, end_time, callback) {
        const sql_query = `
        SELECT * FROM timetable 
        WHERE teacher_id = ? 
        AND course_id = ? 
        AND day_of_week = ? 
        AND start_time = ? 
        AND end_time = ?
    `;
        db.query(sql_query, [teacher_id, course_id, day_of_week, start_time, end_time], callback);
    },

    checkForUpdate: function (teacher_id, course_id, day_of_week, start_time, end_time, timetableId, callback) {
        const sql_query = `
        SELECT * FROM timetable 
        WHERE teacher_id = ? 
        AND course_id = ? 
        AND day_of_week = ? 
        AND start_time = ? 
        AND end_time = ? 
        AND id != ?
    `;
        db.query(sql_query, [teacher_id, course_id, day_of_week, start_time, end_time, timetableId], callback);
    },

    createTimeSlot: function (teacher_id, course_id, day_of_week, start_time, end_time, room, callback) {
        const insertQuery = `
        INSERT INTO timetable (teacher_id, course_id, day_of_week, start_time, end_time, room) 
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [teacher_id, course_id, day_of_week, start_time, end_time, room], callback);
    },

    updateTimeSlot: function (teacher_id, course_id, day_of_week, start_time, end_time, room, timetableId, callback) {
        const updateQuery = `
        UPDATE timetable 
        SET teacher_id = ?, course_id=?, day_of_week=?, start_time=?, end_time=?, room=? 
        WHERE id =?
        `;
        db.query(updateQuery, [teacher_id, course_id, day_of_week, start_time, end_time, room, timetableId], callback);
    },

    delete: function (id, callback) {
        const sql = `DELETE FROM timetable WHERE id = ?`;
        db.query(sql, [id], callback);
    }
};

module.exports = TimetableModel;