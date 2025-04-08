const resultsModel = require('../models/resultModel.js');

exports.getAllResults = function (req, res) {
    resultsModel.getAllResults(function (err, results) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(results);
    });
};

exports.addOrUpdateResults = function (req, res) {
    resultsModel.saveResult(req.body, function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
};

exports.getStudentResults = function (req, res) {
    const studentId = req.user.userID;
    resultsModel.getStudentResults(studentId, function (err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.getEnrolledCourseByStudentID = function (req, res) {
    const studentId = req.params.studentId;
    resultsModel.getEnrolledCoursesByStudentId(studentId, function (err, courses) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(courses);
    });
};

exports.getExistingResults = function (req, res) {
    const { studentId, examId } = req.params;
    resultsModel.getExistingResult(studentId, examId, function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
};