const db = require('../dbModel.js');

exports.retrieveTeacherData = function (teacher_id, res) {
    const sql_query = "SELECT * FROM students WHERE role='teacher' AND id=?";
    db.query(sql_query, [teacher_id], function (err, data) {
        if (err) {
            console.log(err);
        }
        res.json(data[0]);
    });
};

exports.getCoursesByTeacher = function (teacherId, res) {
    const query = `
      SELECT c.* FROM courses c
      JOIN teacher_course tc ON c.id = tc.course_id
      WHERE tc.teacher_id = ?
    `;
    db.query(query, [teacherId], function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
};

exports.getExamsByCourse = function (courseId, res) {
    const query = `SELECT * FROM exams WHERE course_id = ?`;
    db.query(query, [courseId], function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
};

exports.getStudentsByCourse = function (courseId, res) {
    const query = `
      SELECT s.id, s.name, s.email, s.phone FROM students s
      JOIN enrollments e ON s.id = e.student_id
      WHERE e.course_id = ? AND s.role = 'student'
    `;
    db.query(query, [courseId], function (err, data) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(data);
    });
};

exports.submitExamResults = function (exam_id, results, res) {
    const query = `INSERT INTO results (student_id, exam_id, results) VALUES ? 
                   ON DUPLICATE KEY UPDATE results = VALUES(results)`;
    const values = results.map(function (r) {
        return ([r.student_id, exam_id, r.result])
    });

    db.query(query, [values], function (err) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Results submitted successfully" });
    });
}

exports.addExam = function (data, res) {
    const query = `INSERT INTO exams (course_id, exam_name, exam_date, exam_time, exam_type) VALUES (?, ?, ?, ?,?)`;
    const values = [data.course_id, data.exam_name, data.exam_date, data.exam_time, data.exam_type];

    db.query(query, values, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json({ message: "Exam added successfully", exam_id: result.insertId });
    });
};


// Courses
exports.addCourse = (data, res) => {
    db.query('INSERT INTO courses (course_name, course_description, course_period) VALUES (?, ?, ?)',
      [data.course_name, data.course_description, data.course_period],
      (err, result) => err ? res.status(500).json(err) : res.json({ id: result.insertId }));
  };
  
  exports.updateCourse = (id, data, res) => {
    db.query('UPDATE courses SET course_name=?, course_description=?, course_period=? WHERE id=?',
      [data.course_name, data.course_description, data.course_period, id],
      (err, result) => err ? res.status(500).json(err) : res.json({ message: "Course updated" }));
  };
  
  exports.deleteCourse = (id, res) => {
    db.query('DELETE FROM courses WHERE id=?', [id],
      (err, result) => err ? res.status(500).json(err) : res.json({ message: "Course deleted" }));
  };
  
  // Exams
  exports.updateExam = (id, data, res) => {
    db.query('UPDATE exams SET exam_name=?, exam_date=?, exam_time=? WHERE exam_id=?',
      [data.exam_name, data.exam_date, data.exam_time, id],
      (err, result) => err ? res.status(500).json(err) : res.json({ message: "Exam updated" }));
  };
  
  exports.deleteExam = (id, res) => {
    db.query('DELETE FROM exams WHERE exam_id=?', [id],
      (err, result) => err ? res.status(500).json(err) : res.json({ message: "Exam deleted" }));
  };

  exports.retrieveTeacherTimetable = function(teacherId, res){
    const query = `
    SELECT timetable.*, courses.course_name
    FROM timetable
    JOIN courses ON timetable.course_id = courses.id
    WHERE timetable.teacher_id = ?
    ORDER BY FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), start_time
  `;
  db.query(query, [teacherId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
  };
  