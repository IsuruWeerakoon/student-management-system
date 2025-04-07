const express = require('express');
const router = express.Router();
const courseModel = require('../models/courseModel.js');
const { authenticateUser, authorizeAdmin } = require('../middleware/authMiddleware.js');

// Get all courses (Admin Only)
router.get('/courses', authenticateUser, function (req, res) {
    courseModel.retrieveAll(function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
});

// Get specific courses record for Student Dashboard 
router.get('/courses/record', authenticateUser, function (req, res) {
    const courseID = req.user.userID;
    courseModel.retrieveByID(courseID, function (err, data) {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        if (data.length === 0) {
            return res.status(404).json({ error: "Course Details not Found" });
        }
        res.json(data[0]);
    });
});

// Add new courses (Admin Only)
router.post('/courses', authenticateUser, authorizeAdmin, function (req, res) {
    const courseData = [req.body.course_name, req.body.course_description, req.body.course_period];
    courseModel.create(courseData, function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Course Already Registered..' });
        }
        res.json({ message: 'Course Registered Successfully..' });
    });
}
);

// GET /courses/search?query=mark
router.get('/courses/search', authenticateUser, authorizeAdmin, function (req, res) {
    const search = req.query.search;
    const likeSearch = `%${search}%`;
    if (!search) {
        return res.status(400).json({ error: 'Missing search query' });
    }
    courseModel.searchCourse(likeSearch, function (err, data) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(data);
    });
});

// Get specific courses (Admin and Student)
router.get('/courses/:id', authenticateUser, function (req, res) {
    const courseID = req.params.id;
    courseModel.retrieveByID(courseID, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data[0]);
    });
});

// Update existing courses (Both Users)
router.put('/courses/:id', authenticateUser, authorizeAdmin, function (req, res) {
    const courseID = req.params.id;
    const courseData = [req.body.course_name, req.body.course_description, req.body.course_period];
    courseModel.update(courseID, courseData, function (err, data) {
        if (err) {
            return res.status(400).json({ message: "Course Already Registered.." });
        }
        res.json({ message: "Course Details Updated Successfully.." });
    });
});

// Delete courses (Admin Only)
router.delete('/courses/:id', authenticateUser, authorizeAdmin, function (req, res) {
    const courseID = req.params.id;
    courseModel.delete(courseID, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json({ message: 'Course Details Deleted Successfully..' });
    });
});

module.exports = router;