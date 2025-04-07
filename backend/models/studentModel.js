const db = require('./dbModel.js');

const Student = {
    // Get all students (Admin Only)
    retrieveAll: function (callback) {
        const sql_query = "SELECT * FROM students";
        db.query(sql_query, callback);
    },

    // Get specific students (Users and Admin Only)
    retrieveByID: function (studentID, callback) {
        const sql_query = "SELECT * FROM students WHERE id = ?";
        db.query(sql_query, [studentID], callback);
    },

    // Add new student (Admin Only)
    create: function (studentData, callback) {
        const sql_query = "INSERT INTO students (name, email, phone, dob, gender, city, file_path, password, role) VALUES (?)";
        db.query(sql_query, [studentData], callback);
    },

    // Update existing student (Admin Only)
    updatewith_Pic: function (studentID, studentData, callback) {
        const sql_query = "UPDATE students SET name=?, phone=?, dob=?, gender=?, city=?, file_path=? WHERE id=?";
        db.query(sql_query, [...studentData, studentID], callback);
    },

    // Update existing student (Admin Only)
    updatewithout_Pic: function (studentID, studentData, callback) {
        const sql_query = "UPDATE students SET name=?, phone=?, dob=?, gender=?, city=? WHERE id=?";
        db.query(sql_query, [...studentData, studentID], callback);
    },

    // Check Password if available (Admin Only)
    checkPassword: function (studentID, callback) {
        const sql_query = "SELECT password FROM students WHERE id = ?";
        db.query(sql_query, [studentID], callback);
    },

    // Update existing student account (Admin Only)
    updatePassword: function (studentID, newPassword, callback) {
        const sql_query = "UPDATE students SET password=? WHERE id=?";
        db.query(sql_query, [newPassword, studentID], callback);
    },
    
    // Delete student (Admin Only)
    delete: function (studentID, callback) {
        const sql_query = "DELETE FROM students WHERE id = ?";
        db.query(sql_query, [studentID], callback);
    },

    searchStudents : function(searchQuery, callback){
        const sql_query = "SELECT * FROM students WHERE name LIKE ?";
        db.query(sql_query, [searchQuery], callback);
    }
};

module.exports = Student;