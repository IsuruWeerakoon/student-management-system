const express = require('express');
const router = express.Router();
const resultsModel = require('../models/resultModel.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');

// Admin: View all results
router.get('/',authenticateUser, authorizeAdmin, function (req, res) {
    resultsModel.getAllResults(function (err, results) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
});

// Admin: Add or update result
router.post('/',authenticateUser, authorizeAdmin, function (req, res) {
    resultsModel.saveResult(req.body, function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

// Student: View own results
router.get('/student', authenticateUser, function (req, res) {
    const studentId = req.user.userID;
    resultsModel.getStudentResults(studentId, function (err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});

// Get enrolled courses by student ID
router.get('/enrolled-courses/:studentId', function (req, res) {
    const studentId = req.params.studentId;
    resultsModel.getEnrolledCoursesByStudentId(studentId, function (err, courses) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(courses);
    });
});

// Get existing result (auto-fill)
router.get('/existing/:studentId/:examId', function (req, res) {
    const { studentId, examId } = req.params;
    resultsModel.getExistingResult(studentId, examId, function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
});

module.exports = router;