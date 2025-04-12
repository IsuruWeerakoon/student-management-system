const teacherModel = require('../models/teacherModel.js');
const db = require('../dbModel.js');

module.exports = {
    getTeacherCourses: function (req, res) {
        const teacherId = req.params.teacher_id;
        teacherModel.getCoursesByTeacher(teacherId, res);
    },

    addExam: function (req, res) {
        const { course_id, exam_name, exam_date, exam_time, exam_type } = req.body;
        teacherModel.addExam({ course_id, exam_name, exam_date, exam_time, exam_type }, res);
    },

    getCourseExams: function (req, res) {
        const courseId = req.params.course_id;
        teacherModel.getExamsByCourse(courseId, res);
    },

    getEnrolledStudents: function (req, res) {
        const courseId = req.params.course_id;
        teacherModel.getStudentsByCourse(courseId, res);
    },

    submitResults: function (req, res) {
        const { exam_id, results } = req.body;
        teacherModel.submitExamResults(exam_id, results, res);
    },

    getTeacherData: function (req, res) {
        const teacher_id = req.user.userID;
        teacherModel.retrieveTeacherData(teacher_id, res);
    },


    // Courses
    addCourse: (req, res) => teacherModel.addCourse(req.body, res),
    updateCourse: (req, res) => teacherModel.updateCourse(req.params.id, req.body, res),
    deleteCourse: (req, res) => teacherModel.deleteCourse(req.params.id, res),

    // Exams
    updateExam: (req, res) => teacherModel.updateExam(req.params.id, req.body, res),
    deleteExam: (req, res) => teacherModel.deleteExam(req.params.id, res),



    getTeacherTimetable: (req, res) => {
        const teacherId = req.params.teacherId;
        teacherModel.retrieveTeacherTimetable(teacherId, res);
    },

    getAllTeachers: function (req, res) {
        const sql = "SELECT id, name FROM students where role='teacher'";
        db.query(sql, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    }

};

