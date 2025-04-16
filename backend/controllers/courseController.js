const courseModel = require('../models/courseModel.js');

exports.getAllCourse = function (req, res) {
    courseModel.retrieveAll(function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
};

// exports.getCourseByTokenID = function (req, res) {
//     const courseID = req.user.userID;
    // courseModel.retrieveByID(courseID, function (err, data) {
//         if (err) {
//             return res.status(500).json({ error: "Database Error" });
//         }
//         if (data.length === 0) {
//             return res.status(404).json({ error: "Course Details not Found" });
//         }
//         res.json(data[0]);
//     });
// };

exports.getCourseByParamID = function (req, res) {
    const courseID = req.params.id;
    courseModel.retrieveByID(courseID, function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data[0]);
    });
};

exports.registerCourse = function (req, res) {
    const courseData = [req.body.course_name, req.body.course_description, req.body.course_period];
    courseModel.create(courseData, function (err, data) {
        if (err) {
            return res.status(500).json({ message: 'Course Already Registered..' });
        }
        res.json({ message: 'Course Registered Successfully..' });
    });
};

exports.updateCourse = function (req, res) {
    const courseID = req.params.id;
    const courseData = [req.body.course_name, req.body.course_description, req.body.course_period];
    courseModel.update(courseID, courseData, function (err, data) {
        if (err) {
            return res.status(400).json({ message: "Course Already Registered.." });
        }
        res.json({ message: "Course Details Updated Successfully.." });
    });
};

exports.deleteCourse = function (req, res) {
    const courseID = req.params.id;
    courseModel.delete(courseID, function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json({ message: 'Course Details Deleted Successfully..' });
    });
};

// exports.searchCourse = function (req, res) {
//     const search = req.query.search;
//     const likeSearch = `%${search}%`;
//     if (!search) {
//         return res.status(400).json({ error: 'Missing search query' });
//     }
    // courseModel.searchCourse(likeSearch, function (err, data) {
//         if (err) {
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.json(data);
//     });
// };
