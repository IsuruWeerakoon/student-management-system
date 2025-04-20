import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import TeacherExamModal from './TeacherExamModal';
import TeacherResultsModal from './TeacherResultsModal';
import { isPastExam, getDaysRemaining } from '../utils.js';
import socket from '../../config/socket.js';

function TeacherExams() {
    const baseAPI = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true
    });
    const { courseID } = useParams();
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [resultsModal, setResultsModal] = useState(false);
    const [editingExamId, setEditingExamId] = useState(null);
    const [results, setResults] = useState({});
    const [existingResults, setExistingResults] = useState({});
    const [students, setStudents] = useState([]);
    const [examID, setExamID] = useState(null);
    const defaultForm = { course_id: '', exam_name: '', exam_date: '', exam_time: '', exam_type: 'Midterm' };
    const [form, setForm] = useState(defaultForm);

    useEffect(function () {
        fetchStudents();
        function handleEnrollmentChange() { fetchStudents(); };
        socket.on('enrollmentChanage', handleEnrollmentChange);
        return function () { socket.off('enrollmentChanage', handleEnrollmentChange); };
    }, [courseID]);

    useEffect(function () {
        fetchCourse();
        function handleCourseChange() { fetchCourse(); };
        socket.on('courseChange', handleCourseChange);
        return function () { socket.off('courseChange', handleCourseChange); };
    }, [courseID]);

    useEffect(function () {
        fetchExams();
        function handleExamChange() { fetchExams(); };
        socket.on('examChange', handleExamChange);
        return function () { socket.off('examChange', handleExamChange); };
    }, [courseID]);

    useEffect(function () {
        fetchResults();
        function handleResultChange() { fetchResults(); };
        socket.on('resultChange', handleResultChange);
        return function () { socket.off('resultChange', handleResultChange); };
    }, [resultsModal, examID]);

    function fetchStudents() {
        if (!courseID) return;
        baseAPI.get(`/api/teacher/students/${courseID}`)
            .then(function (response) {
                setStudents(response.data);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    function fetchCourse() {
        if (!courseID) return;
        baseAPI.get(`/api/courses/${courseID}`)
            .then(function (response2) {
                setCourses(response2.data)
            })
            .catch(function (err2) {
                console.log(err2);
            });
    }

    async function fetchExams() {
        try {
            const response = await baseAPI.get(`/api/exams/${courseID}`);
            setExams(response.data);
        }
        catch (err) {
            console.error(err)
        }
    }

    function fetchResults() {
        if (resultsModal && examID) {
            baseAPI.get(`/api/results/existing/exam/${examID}`)
                .then(function (res) {
                    const existing = {};
                    res.data.forEach(function (entry) {
                        existing[entry.student_id] = entry.results;
                    });
                    setExistingResults(existing);
                    setResults(existing);
                });
        }
    }

    const hasExistingResults = Object.keys(existingResults).length > 0;

    async function fetchExams() {
        try {
            const response = await baseAPI.get(`/api/exams/${courseID}`);
            setExams(response.data);
        }
        catch (err) {
            console.error(err)
        }
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const request = editingExamId ? baseAPI.put(`/api/exams/${editingExamId}`, form) : baseAPI.post(`/api/exams`, form)
        request
            .then(function () {
                handleReset();
                setShowModal(false);
                fetchExams();
                editingExamId ?
                    toast.success("Exam Updated Successfully..") :
                    toast.success("Exam Registered Successfully...");
            })
            .catch(function (err) {
                toast.error(err.response?.data?.error)
            });
    }

    function startEdit(exam) {
        setEditingExamId(exam.exam_id);
        setForm({
            course_id: exam.course_id,
            exam_name: exam.exam_name,
            exam_date: exam.exam_date.split('T')[0],
            exam_time: exam.exam_time,
            exam_type: exam.exam_type || 'Midterm',
        });
    }

    function handleReset() {
        setForm(defaultForm);
        setEditingExamId(null);
    }

    function handleResultChange(studentId, value) {
        setResults(function (prev) {
            return { ...prev, [studentId]: value };
        });
    }

    function handleSubmitResults() {
        const formatted = Object.entries(results).map(function ([student_id, result]) {
            return {
                student_id: parseInt(student_id),
                result: parseFloat(result)
            };
        });

        baseAPI.post(`/api/results/submit-results`, { exam_id: examID, results: formatted })
            .then(function () {
                toast.success("Results Submitted Successfully..!");
                setResults({});
                setResultsModal(false);
            })
            .catch(function (err) {
                toast.error("Something went Wrong..!");
            });
    }

    function handleExamDelete(examID, examName) {
        var result = confirm(`Are you sure about deleting ${examName}`);
        if (result) {
            baseAPI.delete(`/api/exams/${examID}`)
                .then(function () {
                    toast.info(`${examName} has been Deleted..`);
                    fetchExams();
                })
                .catch(function (err) {
                    console.log(err);
                    toast.error(err.response?.data?.message);
                });
        }
    };

    return (
        <div className='dashboard-container'>
            <h2>Manage {courses.course_name} Exams</h2>
            <div className="button-container">
                <button className='btn btn-reply' type='button' onClick={function () { setShowModal(true) }}>Register New Examinations</button>
            </div>
            <br />
            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Exam Type</th>
                            <th>Course Name</th>
                            <th>Exam Time</th>
                            <th>Exam Date</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            exams.length > 0 && exams.map(function (exam) {
                                const past = isPastExam(exam.exam_date);
                                return (
                                    <tr key={exam.exam_id} className={past ? 'past-exam' : ''}>
                                        <td>{exam.exam_name}</td>
                                        <td>{exam.exam_type}</td>
                                        <td>{exam.course_name}</td>
                                        <td>{exam.exam_time}</td>
                                        <td>
                                            {exam.exam_date.split('T')[0]}
                                            {!isPastExam(exam.exam_date) && (
                                                <div style={{ fontSize: '12px', color: 'green' }}>
                                                    ({getDaysRemaining(exam.exam_date)} days left)
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {
                                                !past ?
                                                    <button className='btn btn-update' onClick={function () { setShowModal(true); startEdit(exam) }}>Edit</button> :
                                                    null
                                            }
                                        </td>
                                        <td>
                                            {
                                                !past ? <button className="btn btn-delete" onClick={function () { handleExamDelete(exam.exam_id, exam.exam_name) }}>Delete</button> :
                                                    <button className='btn btn-register' onClick={function () { setResultsModal(true); setExamID(exam.exam_id) }}>Results</button>
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="button-container">
                <button className='btn btn-cancel' type='button' onClick={function () { navigate('admin-dashboard') }}>Back</button>
            </div>
            {showModal && (
                <TeacherExamModal
                    form={form}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={function () { setShowModal(false); }}
                    onReset={handleReset}
                    editingExamId={editingExamId}
                    courseName={courses.course_name}
                    courseId={courses.id}
                />
            )}

            {resultsModal && (
                <TeacherResultsModal
                    students={students}
                    results={results}
                    onResultChange={handleResultChange}
                    onClose={function () { setResultsModal(false); }}
                    onSubmit={handleSubmitResults}
                    hasExisting={hasExistingResults}
                />
            )}
        </div>
    );
}

export default TeacherExams;