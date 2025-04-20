import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import { isPastExam, getDaysRemaining } from '../utils.js';
import socket from '../../config/socket.js';

function AdminExams() {
    const baseAPI = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true
    });
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const defaultForm = { course_id: '', exam_name: '', exam_date: '', exam_time: '', exam_type: 'midterm' };
    const [form, setForm] = useState(defaultForm);
    const [editingExamId, setEditingExamId] = useState(null);
    const [filteredExams, setFilteredExams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(function () {
        fetchCourse();
        function handleCourseChange() { fetchCourse() };
        socket.on('courseChange', handleCourseChange);
        return function () { socket.off('courseChange', handleCourseChange) };
    }, [courses]);

    function fetchCourse() {
        baseAPI.get(`/api/courses`)
            .then(function (res) {
                setCourses(res.data)
            });
    };

    useEffect(function () {
        fetchExams();
        function handleCourseChange() { fetchExams() };
        socket.on('examChange', handleCourseChange);
        return function () { socket.off('examChange', handleCourseChange) };
    }, [exams]);

    function fetchExams() {
        baseAPI.get(`/api/exams`)
            .then(function (res) {
                setExams(res.data)
                setFilteredExams(res.data);
                setSearchTerm('');
            });
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const request = editingExamId ? baseAPI.put(`/api/exams/${editingExamId}`, form) : baseAPI.post(`/api/exams`, form);
        request
            .then(function () {
                setForm({ course_id: '', exam_name: '', exam_date: '', exam_time: '' });
                setEditingExamId(null);
                handleReset();
                setShowModal(false);

                editingExamId ? toast.success(`"${form.exam_name}" - Updated Successfully..`) : toast.success(`"${form.exam_name}" - Registered Successfully...`);
                fetchExams();
            })
            .catch(function (err) {
                if (err.response && err.response.data?.error) {
                    toast.error(err.response?.data?.error)
                }
                else {
                    console.error(err);
                }
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

    function handleDeleteExam(examID, examName) {
        var result = confirm(`Are you Sure about deleting "${examName}" from the Exams Registry..?`);
        if (result) {
            baseAPI.delete(`/api/exams/${examID}`)
                .then(function () {
                    fetchExams();
                    toast.info(`${examName} has been removed from the Exams Registry..`);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    }

    function handleSearch(event) {
        var value = event.target.value;
        setSearchTerm(value);

        var filtered = exams.filter(function (exam) {
            return Object.values(exam).some(function (field) {
                return String(field).toLowerCase().includes(value.toLowerCase());
            });
        });
        setFilteredExams(filtered);
    }

    return (
        <div className='container'>
            <h2>Manage Exams</h2>
            <div className="button-container">
                <button className='btn btn-register' type='button' onClick={function () { setShowModal(true) }}>Register New Examinations</button>
            </div>
            <input
                type="text"
                placeholder="Search exams..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
            />

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
                            filteredExams.length > 0 && filteredExams.map(function (exam) {
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
                                                !past ?
                                                    <button className='btn btn-delete' onClick={function () { handleDeleteExam(exam.exam_id, exam.exam_name) }}>Delete</button> :
                                                    null
                                            }
                                        </td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            {
                showModal && (
                    <div className='modal'>
                        <div className='modal-content-exams'>
                            <div className="close-container">
                                <button className='btn close-btn' onClick={function () { setShowModal(false); handleReset(); }}>X</button>
                            </div>
                            {editingExamId ?
                                <h2>Examinations Update Form</h2> :
                                <h2>Examinations Registration Form </h2>
                            }
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor='course_id'>Course Name: </label>
                                    <select name="course_id" value={form.course_id} onChange={handleChange} required>
                                        <option value="">Select Course</option>
                                        {courses.map(function (course) {
                                            return (
                                                <option key={course.id} value={course.id}>{course.course_name}</option>
                                            )
                                        })}
                                    </select>

                                </div>
                                <div className="form-group">
                                    <label htmlFor='exam_name'>Exam Name: </label>
                                    <input name="exam_name" placeholder="Exam Name" value={form.exam_name} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor='exam_date'>Exam Date: </label>
                                    <input name="exam_date" type="date" value={form.exam_date} min={new Date().toISOString().split('T')[0]} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor='exam_time'>Exam Time: </label>
                                    <input name="exam_time" type="time" value={form.exam_time} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor='exam_type'>Exam Type: </label>
                                    <select name="exam_type" value={form.exam_type} onChange={handleChange} required>
                                        <option value="Midterm">Midterm</option>
                                        <option value="Final">Final</option>
                                        <option value="Quiz">Quiz</option>
                                        <option value="Project">Project</option>
                                    </select>
                                </div>
                                <div className='button-container'>
                                    {editingExamId ?
                                        <button type="submit" className='btn btn-update'>Update Exam</button> :
                                        <button type="submit" className='btn btn-success'>Create Exam</button>
                                    }
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default AdminExams;