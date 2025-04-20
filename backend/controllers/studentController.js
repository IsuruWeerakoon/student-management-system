const studentModel = require('../models/studentModel.js');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const { io } = require('../server.js');

exports.getAllStudents = function (req, res) {
    studentModel.retrieveAll(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result);
    });
};

exports.getStudent_StudentDashboard = function (req, res) {
    const studentID = req.user.userID; // Extracted from JWT
    studentModel.retrieveByID(studentID, function (err, result) {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: "Student not Found" });
        }
        res.json(result[0]);
    });
};

exports.registerStudent = async function (req, res) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    if (req.file === undefined) {
        const studentData = [req.body.name, req.body.email, req.body.phone, req.body.dob, req.body.gender, req.body.city, null, hashedPassword, req.body.role];
        studentModel.create(studentData, function (err, result) {
            if (err) {
                return res.status(500).json({ message: 'Email Address Already Exists..' });
            }
            io.emit('studentChange');
            res.json({ message: 'Student Registered Successfully..' });
        });
    }
    else {
        const studentData = [req.body.name, req.body.email, req.body.phone, req.body.dob, req.body.gender, req.body.city, req.file.path, hashedPassword, req.body.role];
        studentModel.create(studentData, function (err, result) {
            if (err) {
                return res.status(500).json({ message: 'Email Address Already Exists..' });
            }
            io.emit('studentChange');
            res.json({ message: 'Student Registered Successfully..' });
        });
    }
};

exports.getSpecificStudent = function (req, res) {
    const studentID = req.params.id;
    studentModel.retrieveByID(studentID, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        res.json(result[0]);
    });
};

exports.updateStudent = function (req, res) {
    const studentID = req.params.id;
    if (req.file === undefined) {
        //changed here
        // const studentData = [req.body.name, req.body.email, req.body.phone, req.body.dob, req.body.gender, req.body.city];
        const studentData = [req.body.name, req.body.email, req.body.phone, req.body.city];
        studentModel.updatewithout_Pic(studentID, studentData, function (err, result) {
            if (err) {
                // return res.status(400).json({ message: err });
                return res.status(400).json({ message: "Email Address Already Exists" });
            }
            io.emit('studentChange');
            res.json({ message: "Profile Updated Successfully.." });
        });
    }
    else {
        studentModel.retrieveByID(studentID, function (err, result) {
            if (err) {
                console.log(err);
            }
            const oldPath = result[0].file_path;
            const newPath = 'uploads/' + req.file.filename;
            // changed here
            // const studentData = [req.body.name, req.body.email, req.body.phone, req.body.dob, req.body.gender, req.body.city, newPath];
            const studentData = [req.body.name, req.body.email, req.body.phone, req.body.city, newPath];
            if (oldPath === null) {
                studentModel.updatewith_Pic(studentID, studentData, function (err, result) {
                    if (err) {
                        // return res.status(400).json({ message: err });
                        return res.status(400).json({ message: "Email Address Already Exists" });
                    }
                    io.emit('studentChange');
                    res.json({ message: "Profile Updated Successfully.." });
                });
            }
            else {
                fs.unlink(oldPath, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    studentModel.updatewith_Pic(studentID, studentData, function (err, result) {
                        if (err) {
                            // return res.status(400).json({ message: err });
                            return res.status(400).json({ message: "Email Address Already Exists" });
                        }
                        io.emit('studentChange');
                        res.json({ message: "Profile Updated Successfully.." });
                    });
                });
            }
        });
    }
};

exports.updateAccountDetails = async function (req, res) {
    const { currentPassword, newPassword } = req.body;
    const studentID = req.params.id;
    studentModel.checkPassword(studentID, async function (err, result) {
        if (err) {
            return res.status(404).json({ message: "User not Found.." });
        }
        const isMatch = await bcrypt.compare(currentPassword, result[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current Password is Invalid.." });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        studentModel.updatePassword(studentID, hashedPassword, function (err, result) {
            if (err) {
                return res.status(400).json({ message: "Password Failed to Update.." });
            }
            res.json({ message: "Password Updated Successfully.." });
        });
    });
};

exports.deleteStudent = function (req, res) {
    const studentID = req.params.id;
    studentModel.retrieveByID(studentID, function (err, result) {
        if (err) {
            console.log(err);
        }
        const oldPath = result[0].file_path;
        if (oldPath === null) {
            studentModel.delete(studentID, function (err, result) {
                if (err) {
                    console.log(err);
                }
                io.emit('studentChange');
                res.json({ message: 'Student Record Deleted Successfully..' });
            });
        }
        else {
            fs.unlink(oldPath, function (err) {
                if (err) {
                    console.log(err);
                }
                studentModel.delete(studentID, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    io.emit('studentChange');
                    res.json({ message: 'Student Record Deleted Successfully..' });
                });
            });
        }
    });
};