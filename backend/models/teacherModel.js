const db = require('../dbModel.js');

const Teacher = {

    retrieveTeacherData : function (teacher_id, callback) {
        const sql_query = `SELECT * FROM students WHERE role='teacher' AND id=?`;
        db.query(sql_query, [teacher_id], callback);
    },

    getCoursesByTeacher : function (teacherId, callback) {
        const query = `
        SELECT c.* FROM courses c 
        JOIN teacher_course tc ON c.id = tc.course_id 
        WHERE tc.teacher_id = ?
        `;
        db.query(query, [teacherId], callback);
    },

    getCoursesByTeacher : function (teacherId, callback) {
        const query = `
        SELECT c.* FROM courses c 
        JOIN teacher_course tc ON c.id = tc.course_id 
        WHERE tc.teacher_id = ?
        `;
        db.query(query, [teacherId], callback);
    },

    getStudentsByCourse : function (courseId, callback) {
        const query = `
        SELECT s.id, s.name, s.email, s.phone FROM students s 
        JOIN enrollments e ON s.id = e.student_id 
        WHERE e.course_id = ? AND s.role = 'student'
        `;
        db.query(query, [courseId], callback);
    },

    retrieveTeacherTimetable : function (teacherId, callback) {
        const query = `
        SELECT timetable.*, courses.course_name 
        FROM timetable 
        JOIN courses ON timetable.course_id = courses.id 
        WHERE timetable.teacher_id = ? 
        ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), start_time
        `;
        db.query(query, [teacherId], callback);
    }, 

    retrieveAllTeachers : function(callback){
        const query = `SELECT id, name FROM students where role='teacher'`;
        db.query(query, callback);
    }
};

module.exports = Teacher;