import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify'
import '../../App.css';

const ManageCourses = function () {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [courseData, setCourseData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

    useEffect(function () {
        verifyUserRole();
    }, []);

    useEffect(function () {
        handleSearch();
    }, [searchParams]);

    async function verifyUserRole() {
        try {
            const response = await baseAPI.get('/api/auth/user');
            if (response.data.role !== 'admin') {
                window.location.href = '/login';
            }
        }
        catch (err) {
            console.error('Error fetching user role:', err);
        }
    };

    async function viewCourses() {
        try {
            const response = await baseAPI.get('/api/courses');
            setCourseData(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    async function handleSearch() {
        var search = searchParams.get('search') || '';
        setSearchTerm(search);
        if (!search || search.trim() === '') {
            setCourseData([]);
            return;
        }
        try {
            const response = await baseAPI.get('/api/courses/search?search=' + search);
            setCourseData(Array.isArray(response.data) ? response.data : []);
        }
        catch (err) {
            console.error(err);
        }
    };

    function handleChange(e) {
        var value = e.target.value;
        setSearchTerm(value);
        if (value.trim() === '') {
            searchParams.delete('search');
            setSearchParams(searchParams);
        }
        else {
            setSearchParams({ search: value });
        }
    };

    async function handleDelete(courseID) {
        var result = confirm("Are You Sure about Deleting this Record..?");
        if (result) {
            try {
                await baseAPI.delete(`/api/courses/${courseID}`);
                toast.success("Course Details Deleted Successfully..");
            }
            catch (err) {
                console.error('Error deleting item:', err);
                toast.error(err.response?.data?.message);
            }
        }
    };

    function goToCourseRegister() { navigate('/course_register'); };

    function goBack() { navigate('/admin-dashboard'); };

    return (
        <div className='container'>
            <div>
                <h1>Admin Dashboard</h1>
                <h3>Manage Courses</h3>
                <div className='button-container'>
                    <button className='btn btn-cancel' onClick={goBack}>Back</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-update' type='button' onClick={function () { viewCourses(); setShowModal(true); }}>View All Courses</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-success' onClick={goToCourseRegister}>Register a New Course</button>
                </div>
            </div>
            <div className="form-group">
                <input type="text" placeholder="Search Courses" value={searchTerm} onChange={handleChange} />
            </div>

            <div className='table-container'>
                {searchTerm.trim() !== '' ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Description</th>
                                <th>Course Period</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courseData.length > 0 ? (
                                    courseData.map(function (course) {
                                        return (
                                            <tr key={course.id}>
                                                <td>{course.course_name}</td>
                                                <td>{course.course_description}</td>
                                                <td>{course.course_period}</td>
                                                <td><button className='btn btn-update' onClick={function () { navigate(`/course_update/${course.id}`) }}>Edit</button></td>
                                                <td><button className='btn btn-delete' onClick={function () { handleDelete(course.id) }}>Delete</button></td>
                                            </tr>)
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="3">No Results Found</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        Start typing to Search for Courses...
                    </div>
                )
                }
            </div>


            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="close-container">
                            <button className='btn close-btn' onClick={function () { setShowModal(false) }}>X</button>
                        </div>
                        <h2>Registered Course Details</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course Name</th>
                                    <th>Course Description</th>
                                    <th>Course Period</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    courseData.length > 0 ? (
                                        courseData.map(function (data) {
                                            return (
                                                <tr key={data.id}>
                                                    <td>{data.course_name}</td>
                                                    <td>{data.course_description}</td>
                                                    <td>{data.course_period}</td>
                                                </tr>)
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="3">No Results Found</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageCourses;