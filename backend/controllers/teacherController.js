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
