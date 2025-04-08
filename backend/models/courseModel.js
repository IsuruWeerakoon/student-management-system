const db = require('../dbModel.js');

const Course = {
    // Get all courses (Admin Only)
    retrieveAll: function (callback) {
        const sql_query = "SELECT * FROM courses";
        db.query(sql_query, callback);
    },

    // Get specific courses (Users and Admin Only)
    retrieveByID: function (studentID, callback) {
        const sql_query = "SELECT * FROM courses WHERE id = ?";
        db.query(sql_query, [studentID], callback);
    },

    // Add new courses (Admin Only)
    create: function (courseData, callback) {
        const sql_query = "INSERT INTO courses (course_name, course_description, course_period) VALUES (?)";
        db.query(sql_query, [courseData], callback);
    },

    // Update existing courses (Admin Only)
    update: function (courseID, courseData, callback) {
        const sql_query = "UPDATE courses SET course_name=?, course_description=?, course_period=? WHERE id=?";
        db.query(sql_query, [...courseData, courseID], callback);
    },

    // Delete courses (Admin Only)
    delete: function (courseID, callback) {
        const sql_query = "DELETE FROM courses WHERE id = ?";
        db.query(sql_query, [courseID], callback);
    },

    searchCourse : function(searchQuery, callback){
        const sql_query = "SELECT * FROM courses WHERE course_name LIKE ?";
        db.query(sql_query, [searchQuery], callback);
    }
};

module.exports = Course;