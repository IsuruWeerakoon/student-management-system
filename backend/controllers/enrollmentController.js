const enrollmentModel = require('../models/enrollmentModel.js');

exports.get_All_Course_And_Enrollments = function (req, res) {
    const studentId = req.user.userID;
    enrollmentModel.getAllCourses(function (err, allCourses) {
        if (err) {
            return res.status(500).send(err);
        }
        enrollmentModel.getEnrolledCourses(studentId, function (err2, enrolled) {
            if (err2) {
                return res.status(500).send(err2);
            }
            const enrolledCourseIds = enrolled.map(row => row.course_id);
            res.json({ allCourses, enrolledCourseIds });
        });
    });
};

exports.student_Enroll = function (req, res) {
    const studentId = req.user.userID;
    const { courseId } = req.body;

    enrollmentModel.enrollInCourse(studentId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Enrolled successfully' });
    });
};

exports.student_Unenroll = function (req, res) {
    const studentId = req.user.userID;
    const { courseId } = req.body;

    enrollmentModel.unenrollFromCourse(studentId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Unenrolled successfully' });
    });
};

exports.admin_Get_All_Students = function (req, res) {
    enrollmentModel.getAllStudents(function (err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(result);
    });
};

exports.admin_Get_All_Course_And_Enrollments = function (req, res) {
    const studentId = req.params.studentId;

    enrollmentModel.getAllCourses(function (err, allCourses) {
        if (err) {
            return res.status(500).send(err);
        }
        enrollmentModel.getEnrolledCourses(studentId, function (err2, enrolled) {
            if (err2) {
                return res.status(500).send(err2);
            }
            const enrolledCourseIds = [...new Set(enrolled.map(function (row) { return row.course_id }))];
            res.json({ allCourses, enrolledCourseIds });
        });
    });
};

exports.admin_Enroll_Student = function (req, res) {
    const { studentId, courseId } = req.body;
    enrollmentModel.enrollInCourse(studentId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Student enrolled' });
    });
};

exports.admin_Unenroll_Student = function (req, res) {
    const { studentId, courseId } = req.body;
    enrollmentModel.unenrollFromCourse(studentId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ message: 'Student unenrolled' });
    });
};
