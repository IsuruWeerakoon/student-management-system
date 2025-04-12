const db = require('../dbModel.js');

const Results = {
  getAllResults: function (callback) {
    const query = `
        SELECT r.*, s.name as student_name, e.exam_name, c.course_name
        FROM results r
        JOIN students s ON r.student_id = s.id
        JOIN exams e ON r.exam_id = e.exam_id
        JOIN courses c ON e.course_id = c.id
    `;
    db.query(query, callback);
  },

  saveResult: function (data, callback) {
    const checkQuery = `SELECT * FROM results WHERE student_id = ? AND exam_id = ?`;
    const updateQuery = `UPDATE results SET results = ? WHERE student_id = ? AND exam_id = ?`;
    const insertQuery = `INSERT INTO results (student_id, exam_id, results) VALUES (?, ?, ?)`;

    db.query(checkQuery, [data.student_id, data.exam_id], function (err, result) {
      if (err) return callback(err);

      if (result.length > 0) {
        // Update existing result
        db.query(updateQuery, [data.results, data.student_id, data.exam_id], function (err2, res2) {
          if (err2) return callback(err2);
          callback(null, { message: 'Updated' });
        });
      } else {
        // Insert new result
        db.query(insertQuery, [data.student_id, data.exam_id, data.results], function (err3, res3) {
          if (err3) return callback(err3);
          callback(null, { message: 'Inserted' });
        });
      }
    });
  },

  getEnrolledCoursesByStudentId: function (studentId, callback) {
    const query = `
        SELECT courses.id, courses.course_name
        FROM courses
        JOIN enrollments ON courses.id = enrollments.course_id
        WHERE enrollments.student_id = ?
    `;
    db.query(query, [studentId], callback);
  },

  getExistingResult: function (studentId, examId, callback) {
    const query = `SELECT results FROM results WHERE student_id = ? AND exam_id = ?`;
    db.query(query, [studentId, examId], function (err, result) {
      if (err) return callback(err);
      callback(null, result[0] || {});
    });
  },

  getStudentResults : function (studentId, callback) {
    const query = `
        SELECT exams.exam_name, courses.course_name, results.results
        FROM results
        JOIN exams ON results.exam_id = exams.exam_id
        JOIN courses ON exams.course_id = courses.id
        WHERE results.student_id = ?
    `;
    db.query(query, [studentId], callback);
}, 

getAllExistingResultsForExam: function (examId, callback) {
  const query = `SELECT student_id, results FROM results WHERE exam_id = ?`;
  db.query(query, [examId], function (err, result) {
      if (err) return callback(err);
      callback(null, result); // array of { student_id, results }
  });
},

insertOrUpdateResults: function (examId, resultsArray, callback) {
  if (!resultsArray || resultsArray.length === 0) return callback(null);

  const values = resultsArray.map(r => [r.student_id, examId, r.result]);

  const query = `
      INSERT INTO results (student_id, exam_id, results)
      VALUES ?
      ON DUPLICATE KEY UPDATE results = VALUES(results)
  `;

  db.query(query, [values], function (err) {
      if (err) return callback(err);
      callback(null);
  });
}


  
};
module.exports = Results;