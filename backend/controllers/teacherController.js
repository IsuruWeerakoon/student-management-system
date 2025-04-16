const teacherModel = require('../models/teacherModel.js');


    exports.getTeacherCourses = function (req, res) {
        const teacherId = req.params.teacher_id;
        teacherModel.getCoursesByTeacher(teacherId, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    };

    exports.getEnrolledStudents = function (req, res) {
        const courseId = req.params.course_id;
        teacherModel.getStudentsByCourse(courseId, function (err, result) {
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    };

    exports.getTeacherData = function (req, res) {
        const teacher_id = req.user.userID;
        teacherModel.retrieveTeacherData(teacher_id, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.json(result[0]);
        });
    };

    exports.getTeacherTimetable = function (req, res) {
        const teacherId = req.params.teacherId;
        teacherModel.retrieveTeacherTimetable(teacherId, function (err, result) {
            if (err) return res.status(500).json(err);
            res.json(result);
        });
    };

    exports.getAllTeachers = function (req, res) {
        teacherModel.retrieveAllTeachers(function(err, result){
            if (err) {
                return res.status(500).json(err);
            }
            res.json(result);
        });
    };

    // addExam: function (req, res) {
    //     const { course_id, exam_name, exam_date, exam_time, exam_type } = req.body;
    //     teacherModel.addExam({ course_id, exam_name, exam_date, exam_time, exam_type }, res);
    // },

    // getCourseExams: function (req, res) {
    //     const courseId = req.params.course_id;
    //     teacherModel.getExamsByCourse(courseId, res);
    // },

    // submitResults: function (req, res) {
    //     const { exam_id, results } = req.body;
    //     teacherModel.submitExamResults(exam_id, results, res);
    // },

    // Courses
    // addCourse: (req, res) => teacherModel.addCourse(req.body, res),
    // updateCourse: (req, res) => teacherModel.updateCourse(req.params.id, req.body, res),
    // deleteCourse: (req, res) => teacherModel.deleteCourse(req.params.id, res),

    // Exams
    // updateExam: (req, res) => teacherModel.updateExam(req.params.id, req.body, res),
    // deleteExam: (req, res) => teacherModel.deleteExam(req.params.id, res),

