const TimetableModel = require('../models/TimetableModel');
const db = require('../dbModel.js');

exports.getTimetableByTeacher = function (req, res) {
    TimetableModel.getByTeacherId(req.params.teacherId, function (err, result) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json(result);
    });
};

exports.addTimeSlot = function (req, res) {
    const { teacher_id, course_id, day_of_week, start_time, end_time, room } = req.body;

    TimetableModel.checkForInsert(teacher_id, course_id, day_of_week, start_time, end_time, function (err, result) {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: "This time slot already exists for the teacher and course." });
        }
        TimetableModel.createTimeSlot(teacher_id, course_id, day_of_week, start_time, end_time, room, function (err, result) {
            if (err) {
                return res.status(500).json({ message: "Insert failed" });
            }
            res.status(200).json({ message: "Time slot added successfully" });
        });
    });
};


exports.updateTimeSlot = function (req, res) {
    const { id } = req.params;
    const { teacher_id, course_id, day_of_week, start_time, end_time, room } = req.body;

    TimetableModel.checkForUpdate(teacher_id, course_id, day_of_week, start_time, end_time, id, function (err, result) {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (result.length > 0) {
            return res.status(400).json({ message: "This time slot already exists for the teacher and course." });
        }
        TimetableModel.updateTimeSlot(teacher_id, course_id, day_of_week, start_time, end_time, room, id, function(err, result){
            if(err){
                return res.status(500).json({ message: "Update failed" });
            }
            res.status(200).json({ message: "Time slot updated successfully" });
        });
    });
};

exports.deleteTimetableSlot = function (req, res) {
    TimetableModel.delete(req.params.id, function (err) {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.json({ message: "Time slot deleted" });
    });
};