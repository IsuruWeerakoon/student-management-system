const db = require('../dbModel.js');

const Enrollment = {
    getEnrolledCourses: function (studentId, callback) {
        const sql_query = `SELECT course_id FROM enrollments WHERE student_id = ?`;
        db.query(sql_query, [studentId], callback);
    },

    getAssignedCourses: function (teacher_Id, callback) {
        const sql_query = `SELECT course_id FROM teacher_course WHERE teacher_id = ?`;
        db.query(sql_query, [teacher_Id], callback);
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

    assignInCourse: function (teacher_Id, courseId, callback) {
        const sql = `INSERT IGNORE INTO teacher_course (teacher_id, course_id) VALUES (?, ?)`;
        db.query(sql, [teacher_Id, courseId], callback);
    },

    unassignFromCourse: function (teacher_Id, courseId, callback) {
        const sql_query = `DELETE FROM teacher_course WHERE teacher_id = ? AND course_id = ?`;
        db.query(sql_query, [teacher_Id, courseId], callback);
    }, 

    getAllStudents : function(callback){
        const sql_query = `SELECT id, name, email FROM students WHERE role = 'student'`;
        db.query(sql_query, callback);
    },

    getAllTeachers : function(callback){
        const sql_query = `SELECT id, name, email FROM students WHERE role = 'teacher'`;
        db.query(sql_query, callback);
    }
};

module.exports = Enrollment;