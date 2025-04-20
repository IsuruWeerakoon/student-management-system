const examModel = require('../models/examModel.js');
const { io } = require('../server.js');

exports.getAllExams = function (req, res) {
    examModel.getAllExams(function (err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.registerExam = function (req, res) {
    const data = req.body;
    // Disallow past dates
    const today = new Date().toISOString().split('T')[0];
    if (data.exam_date < today) {
        return res.status(400).json({ error: 'Exam date cannot be in the past.' });
    }
    examModel.checkDuplicateExam(data.course_id, data.exam_name, function (err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        if (results.length > 0) {
            return res.status(400).json({ error: 'Exam name already exists for this course.' });
        }
        examModel.createExam(data, function (err2) {
            if (err2) {
                return res.status(500).send(err2);
            }
            io.emit('examChange');
            res.json({ message: 'Exam created successfully' });
        });
    });
};

exports.updateExam = function (req, res) {
    const examId = req.params.examId;
    const data = req.body;
    // Disallow past dates
    const today = new Date().toISOString().split('T')[0];
    if (data.exam_date < today) {
        return res.status(400).json({ error: 'Exam date cannot be in the past.' });
    }
    examModel.checkDuplicateforUpdate(data.course_id, data.exam_name, examId, function(err, results){
        if(err){
            return res.status(500).send(err);
        }
        if(results.length > 0){
            return res.status(400).json({ error: 'Another exam with this name already exists for this course.' });
        }
        examModel.updateExam(examId, data, function (err2) {
            if (err2) {
                return res.status(500).send(err2);
            }
            io.emit('examChange');
            res.json({ message: 'Exam updated successfully' });
        });
    });
};

exports.getExamsForStudents = function (req, res) {
    const studentId = req.user.userID;
    examModel.getExamsByStudentId(studentId, function (err, results) {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.getExamsForCourse = function(req, res){
    const courseID = req.params.id;
    examModel.getExamsByCourseID(courseID, function(err, data){
        if(err){
            return res.status(500).send(err);
        }
        res.json(data);
    });
};

exports.deleteExamsUsingID = function(req, res){
    const examID = req.params.examId;
    examModel.deleteExamsByExamID(examID, function(err, data){
        if(err){
            return res.status(500).send(err);
        }
        io.emit('examChange');
        res.json(data);
    });
};