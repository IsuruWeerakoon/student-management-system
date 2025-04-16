import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import API_BASE_URL from '../../config/apiConfig';

function AdminResults() {
    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [buttonState, setButtonState] = useState('');
    const defaultForm = { student_id: '', exam_id: '', results: '' };
    const [form, setForm] = useState(defaultForm);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

    useEffect(function () {
        baseAPI.get(`/api/results`)
            .then(function (res) {
                setResults(res.data)
            });
        baseAPI.get(`/api/students`)
            .then(function (res) {
                const filteredStudents = res.data.filter(function (student) {
                    return student.role === 'student';
                });
                setStudents(filteredStudents);
            });
        baseAPI.get(`/api/exams`)
            .then(function (res) {
                setExams(res.data)
            });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        // If student selected
        if (name === 'student_id') {
            setForm({ ...form, student_id: value, exam_id: '', results: '' });
            setButtonState('Insert');
            baseAPI.get(`/api/results/enrolled-courses/${value}`)
                .then(function (res) {
                    const enrolledCourseIds = res.data.map(function (course) { return course.id });
                    const matchedExams = exams.filter(function (exam) {
                        const examDate = new Date(exam.exam_date);
                        const today = new Date();
                        return enrolledCourseIds.includes(exam.course_id) && examDate < today;
                    });
                    setFilteredExams(matchedExams);
                });
        }

        // If exam selected, check for existing result
        else if (name === 'exam_id') {
            const newForm = { ...form, exam_id: value };
            setForm(newForm);
            if (form.student_id) {
                baseAPI.get(`/api/results/existing/${form.student_id}/${value}`)
                    .then(function (res) {
                        if (res.data && res.data.results !== undefined) {
                            setForm({ ...newForm, results: res.data.results });
                            setButtonState('Update');
                        }
                        else {
                            setForm({ ...newForm, results: '' });
                            setButtonState('Insert');
                        }
                    });
            }
        }
        else {
            setForm({ ...form, [name]: value });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        baseAPI.post(`/api/results`, form)
            .then(function (res) {
                const message = res.data.message;
                if (message === 'Updated') {
                    toast.info('Result Updated Successfully..');
                }
                else if (message === "Inserted") {
                    toast.success('Result Saved Successfully..');
                }
                setForm(defaultForm);
                setButtonState('');
                baseAPI.get(`/api/results`).then(function (res) { setResults(res.data) });
            })
            .catch(function () {
                toast.error('Error saving result')
            });
    }

    function groupResultsByStudent(data) {
        const grouped = {};
        data.forEach(function (result) {
            if (!grouped[result.student_name]) {
                grouped[result.student_name] = [];
            }
            grouped[result.student_name].push(result);
        });
        return grouped;
    }

    return (
        <div className='container'>
                <h3>Manage Exam Results</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Student:</label>
                        <select name="student_id" value={form.student_id} onChange={handleChange} required>
                            <option value="">Select Student</option>
                            {students.map(function (student) { return (<option key={student.id} value={student.id}>{student.name}</option>) })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Exam:</label>
                        <select name="exam_id" value={form.exam_id} onChange={handleChange} required>
                            <option value="">Select Exam</option>
                            {filteredExams.map(function (exam) {
                                return (
                                    <option key={exam.exam_id} value={exam.exam_id}>
                                        {exam.exam_name} ({exam.course_name})
                                    </option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Result:</label>
                        <input name="results" type="number" placeholder="Score" value={form.results} onChange={handleChange} required />
                    </div>

                    <div className="button-container">
                        {
                            buttonState === 'Update' ?
                                <button className='btn btn-update' type="submit">Update Result</button> :
                                <button className='btn btn-success' type="submit">Save Result</button>
                        }
                    </div>
                </form>

                <div className="button-container">
                    <button className='btn btn-register' type='button' onClick={function () { setShowModal(true) }}>View All Results</button>
                </div>

                {showModal && (
                    <div className="modal">
                        <div className='modal-content-results'>
                            <div className="close-container">
                                <button className='btn close-btn' onClick={function () { setShowModal(false) }}>X</button>
                            </div>
                            <h3>All Results (Grouped by Student)</h3>
                            {Object.entries(groupResultsByStudent(results)).map(function ([studentName, exams]) {
                                return (
                                    <div key={studentName} style={{ marginBottom: '1rem' }}>
                                        <h4><strong>{studentName}</strong></h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Exam Name</th>
                                                    <th>Course Name</th>
                                                    <th>Results</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exams.map(function (result, index) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{result.exam_name}</td>
                                                            <td>{result.course_name}</td>
                                                            <td>{result.results}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
    );
}

export default AdminResults;