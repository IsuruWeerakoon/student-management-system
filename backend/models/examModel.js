const db = require('../dbModel.js');

const Exam = {
    getAllExams: function (callback) {
        const sql = `
      SELECT exams.*, courses.course_name 
      FROM exams 
      JOIN courses ON exams.course_id = courses.id
      ORDER BY exam_date ASC`;
        db.query(sql, callback);
    },

    createExam: function (data, callback) {
        const sql = 'INSERT INTO exams (course_id, exam_name, exam_date, exam_time, exam_type) VALUES (?, ?, ?, ?, ?)';
        db.query(sql, [data.course_id, data.exam_name, data.exam_date, data.exam_time, data.exam_type], callback);
    },

    updateExam: function (examId, data, callback) {
        const sql = 'UPDATE exams SET course_id = ?, exam_name = ?, exam_date = ?, exam_time = ?, exam_type = ? WHERE exam_id = ?';
        db.query(sql, [data.course_id, data.exam_name, data.exam_date, data.exam_time, data.exam_type, examId], callback);
    },

    getExamsByStudentId: function (studentId, callback) {
        const sql = `
      SELECT exams.*, courses.course_name 
      FROM exams
      JOIN courses ON exams.course_id = courses.id
      JOIN enrollments ON courses.id = enrollments.course_id
      WHERE enrollments.student_id = ?`;
        db.query(sql, [studentId], callback);
    },

    checkDuplicateExam: function (course_id, exam_name, callback) {
        const sql = 'SELECT * FROM exams WHERE course_id = ? AND exam_name = ?';
        db.query(sql, [course_id, exam_name], callback);
    },

    checkDuplicateforUpdate: function (course_id, exam_name, exam_id, callback) {
        const sql = 'SELECT * FROM exams WHERE course_id = ? AND exam_name = ? AND exam_id != ?';
        db.query(sql, [course_id, exam_name, exam_id], callback);
    },

    getExamsByCourseID: function (courseID, callback) {
        const sql = `
      SELECT exams.*, courses.course_name 
      FROM exams 
      JOIN courses ON exams.course_id = courses.id
      WHERE exams.course_id = ?
       ORDER BY exam_date ASC`;
        db.query(sql, [courseID], callback);
    },

    deleteExamsByExamID: function(examID, callback){
        const sql = "DELETE FROM exams WHERE exam_id = ?";
        db.query(sql, [examID], callback);
    }
};

module.exports = Exam;