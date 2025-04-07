import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import '../../App.css';

function AdminExams() {
    const [exams, setExams] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const defaultForm = { course_id: '', exam_name: '', exam_date: '', exam_time: '', exam_type: 'midterm' };
    const [form, setForm] = useState(defaultForm);
    const [editingExamId, setEditingExamId] = useState(null);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

    useEffect(function () {
        baseAPI.get('/api/courses')
            .then(function (res) {
                setCourses(res.data)
            });
        fetchExams();
    }, []);

    function fetchExams() {
        baseAPI.get('/api/exams')
            .then(function (res) {
                setExams(res.data)
            });
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        const request = editingExamId ? baseAPI.put(`/api/exams/${editingExamId}`, form) : baseAPI.post('/api/exams', form);
        request
            .then(function () {
                setForm({ course_id: '', exam_name: '', exam_date: '', exam_time: '' });
                setEditingExamId(null);
                handleReset();
                setShowModal(false);

                editingExamId ? toast.info("Exam Updated Successfully..") : toast.success("Exam Registered Successfully...");
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
            exam_type: exam.exam_type || 'midterm',
        });
    }

    function handleReset() {
        setForm(defaultForm);
        setEditingExamId(null);
    }

    function isPastExam(dateStr) {
        const today = new Date();
        const examDate = new Date(dateStr);
        return examDate < today.setHours(0, 0, 0, 0);
    }

    function getDaysRemaining(dateStr) {
        const today = new Date();
        const examDate = new Date(dateStr);
        const diffTime = examDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    }

    return (
        <div className='container'>
            <h1>Admin Dashboard</h1>
            <h3>Manage Exams</h3>
            <div className="button-container">
                <button className='btn btn-register' type='button' onClick={function () { setShowModal(true) }}>Register New Examinations</button>
            </div>
            {
                showModal && (
                    <div className='modal'>
                        <div className='modal-content'>
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
                                        <option value="midterm">Midterm</option>
                                        <option value="final">Final</option>
                                        <option value="quiz">Quiz</option>
                                        <option value="project">Project</option>
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

            <h3>Registered Exams</h3>
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
                                                !past &&
                                                <button className='btn btn-update' onClick={function () { setShowModal(true); startEdit(exam) }}>Edit</button>
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
        </div>
    );
}

export default AdminExams;