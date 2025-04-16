const db = require('../dbModel.js');

const Enrollment = {
    getEnrolledCourses: function (studentId, callback) {
        const sql_query = `SELECT course_id FROM enrollments WHERE student_id = ?`;
        db.query(sql_query, [studentId], callback);
    },

    getAllCourses: function (callback) {
        const sql_query = `SELECT * FROM courses`;
        db.query(sql_query, callback);
    },

    enrollInCourse: function (studentId, courseId, callback) {
        const sql = `INSERT IGNORE INTO enrollments (student_id, course_id) VALUES (?, ?)`;
        db.query(sql, [studentId, courseId], callback);
    },

    unenrollFromCourse: function (studentId, courseId, callback) {
        const sql_query = `DELETE FROM enrollments WHERE student_id = ? AND course_id = ?`;
        db.query(sql_query, [studentId, courseId], callback);
    }, 

    getAllStudents : function(callback){
        const sql_query = `SELECT id, name, email FROM students WHERE role = "student"`;
        db.query(sql_query, callback);
    }
};

module.exports = Enrollment;