const enrollmentModel = require('../models/enrollmentModel.js');
const { io } = require('../server.js');

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
            const enrolledCourseIds = enrolled.map(function (row) {
                return row.course_id;
            });

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
        io.emit('enrollmentChanage');
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
        io.emit('enrollmentChanage');
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

exports.admin_Get_All_Teachers = function (req, res) {
    enrollmentModel.getAllTeachers(function (err, result) {
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

exports.admin_Get_All_Course_And_Teacher_Enrollments = function (req, res) {
    const teacher_Id = req.params.teacherId;

    enrollmentModel.getAllCourses(function (err, allCourses) {
        if (err) {
            return res.status(500).send(err);
        }
        enrollmentModel.getAssignedCourses(teacher_Id, function (err2, enrolled) {
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
        io.emit('enrollmentChanage');
        res.json({ message: 'Student enrolled' });
    });
};

exports.admin_Unenroll_Student = function (req, res) {
    const { studentId, courseId } = req.body;
    enrollmentModel.unenrollFromCourse(studentId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        io.emit('enrollmentChanage');
        res.json({ message: 'Student unenrolled' });
    });
};

exports.admin_Assign_Teacher = function (req, res) {
    const { teacherId, courseId } = req.body;
    enrollmentModel.assignInCourse(teacherId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        io.emit('enrollmentChanage');
        res.json({ message: 'Teacher Assigned Successfully..' });
    });
};

exports.admin_Unassign_Teacher = function (req, res) {
    const { teacherId, courseId } = req.body;
    enrollmentModel.unassignFromCourse(teacherId, courseId, function (err) {
        if (err) {
            return res.status(500).send(err);
        }
        io.emit('enrollmentChanage');
        res.json({ message: 'Teacher Unassigned Successfully..' });
    });
};
