const express = require('express');
const router = express.Router();
const Exam = require('../models/examModel');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');
const db = require('../models/dbModel.js');

// Admin: Get all exams
router.get('/', authenticateUser, authorizeAdmin, function (req, res) {
    Exam.getAllExams(function (err, results) {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Admin: Create exam
router.post('/', authenticateUser, authorizeAdmin, function (req, res) {
    const data = req.body;
    // Disallow past dates
    const today = new Date().toISOString().split('T')[0];
    if (data.exam_date < today) {
        return res.status(400).json({ error: 'Exam date cannot be in the past.' });
    }

    Exam.checkDuplicateExam(data.course_id, data.exam_name, function (err, results) {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            return res.status(400).json({ error: 'Exam name already exists for this course.' });
        }

        Exam.createExam(data, function (err2) {
            if (err2) return res.status(500).send(err2);
            res.json({ message: 'Exam created successfully' });
        });
    });
});

// Admin: Update exam
router.put('/:examId', authenticateUser, authorizeAdmin, function (req, res) {
    const examId = req.params.examId;
    const data = req.body;

    // Disallow past dates
    const today = new Date().toISOString().split('T')[0];
    if (data.exam_date < today) {
        return res.status(400).json({ error: 'Exam date cannot be in the past.' });
    }

    const checkSql = `
      SELECT * FROM exams 
      WHERE course_id = ? AND exam_name = ? AND exam_id != ?
    `;
    db.query(checkSql, [data.course_id, data.exam_name, examId], function (err, results) {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            return res.status(400).json({ error: 'Another exam with this name already exists for this course.' });
        }
        Exam.updateExam(examId, data, function (err2) {
            if (err2) return res.status(500).send(err2);
            res.json({ message: 'Exam updated successfully' });
        });
    });
});

// Student: View exams for their enrolled courses
router.get('/studentdata', authenticateUser, function (req, res) {
    const studentId = req.user.userID;
    Exam.getExamsByStudentId(studentId, function (err, results) {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

module.exports = router;