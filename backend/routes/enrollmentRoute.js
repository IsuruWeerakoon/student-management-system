const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollmentModel.js');
const {authenticateUser, authorizeAdmin} = require('../middleware/authMiddleware.js');

//Routes for Students to get enrolled in courses
// Get all courses + enrolled ones
router.get('/', authenticateUser, function(req, res) {
  const studentId = req.user.userID;
  Enrollment.getAllCourses(function(err, allCourses) {
    if (err) {
        return res.status(500).send(err);
    }
    Enrollment.getEnrolledCourses(studentId, function(err2, enrolled) {
      if (err2) {
        return res.status(500).send(err2);
      }
      const enrolledCourseIds = enrolled.map(row => row.course_id);
      res.json({ allCourses, enrolledCourseIds });
    });
  });
});

// Enroll in course
router.post('/enroll', authenticateUser, function(req, res) {
  const studentId = req.user.userID;
  const { courseId } = req.body;

  Enrollment.enrollInCourse(studentId, courseId, function(err) {
    if (err) {
        return res.status(500).send(err);
    }
    res.json({ message: 'Enrolled successfully' });
  });
});

// Unenroll from course
router.post('/unenroll', authenticateUser, authorizeAdmin, function(req, res) {
  const studentId = req.user.userID;
  const { courseId } = req.body;

  Enrollment.unenrollFromCourse(studentId, courseId, function(err) {
    if (err) {
        return res.status(500).send(err);
    }
    res.json({ message: 'Unenrolled successfully' });
  });
});


// Routes for Admins to Enroll Students in Courses
// Get all students
router.get('/admin/students', authenticateUser, authorizeAdmin, function (req, res) {
  Enrollment.getAllStudents(function(err, result){
    if (err) {
      return res.status(500).send(err);
    }
    res.json(result);
  });
});

// Get all courses + enrolled courses for a student
router.get('/admin/student-courses/:studentId', authenticateUser, authorizeAdmin, function (req, res) {
  const studentId = req.params.studentId;

  Enrollment.getAllCourses(function (err, allCourses) {
    if (err) {
      return res.status(500).send(err);
    }
    Enrollment.getEnrolledCourses(studentId, function (err2, enrolled) {
      if (err2) {
        return res.status(500).send(err2);
      }
      const enrolledCourseIds = [...new Set(enrolled.map(function (row) { return row.course_id }))];
      res.json({ allCourses, enrolledCourseIds });
    });
  });
});

// Enroll a student in a course
router.post('/admin/enroll', authenticateUser, authorizeAdmin, function (req, res) {
  const { studentId, courseId } = req.body;
  Enrollment.enrollInCourse(studentId, courseId, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Student enrolled' });
  });
});

// Unenroll a student from a course
router.post('/admin/unenroll', authenticateUser, authorizeAdmin, function (req, res) {
  const { studentId, courseId } = req.body;
  Enrollment.unenrollFromCourse(studentId, courseId, function (err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({ message: 'Student unenrolled' });
  });
});


module.exports = router;