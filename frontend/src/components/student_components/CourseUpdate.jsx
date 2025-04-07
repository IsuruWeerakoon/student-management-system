import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import '../../App.css';

function CourseUpdate() {
    const { courseID } = useParams();
    const [courseData, setCourseData] = useState({ course_name: '', course_description: '', course_period: '' });
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

    useEffect(function () {
        verifyUserRole();
        fetchUserData();
    }, []);

    async function verifyUserRole() {
        try {
            const response = await baseAPI.get('/api/auth/user');
            if (response.data.role !== 'admin') {
                window.location.href = '/login';
            }
        }
        catch (err) {
            console.error('Error fetching user role:', err);
            toast.error(err.response?.data?.message);
        }
    };

    async function fetchUserData() {
        try {
            const response = await baseAPI.get(`/api/courses/${courseID}`);
            setCourseData(response.data);
        }
        catch (err) {
            console.error('Error fetching data:', err);
            toast.error(err.response?.data?.message);
        }
    };

    function handleChange(e) {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    async function handleUpdate(e) {
        e.preventDefault();
        try {
            await baseAPI.put(`/api/courses/${courseID}`, courseData);
            toast.success('Course Details Updated Successfully');
            navigate(-1);
        }
        catch (err) {
            console.error('Error updating data:', err);
            toast.error(err.response?.data?.message);
        }
    };

    return (
        <div className='model>'>
            <div className="modal-content">
                <div className="close-container">
                    <button className='btn close-btn' onClick={function () { navigate(-1) }}>X</button>
                </div>
                <h2>Course Update Form</h2>
                <form onSubmit={handleUpdate}>

                    <div className="form-group">
                        <label htmlFor='course_name'>Course Name: </label>
                        <input type='text' name='course_name' placeholder='Course Name' onChange={handleChange} required value={courseData.course_name} />
                    </div>

                    <div className="form-group">
                        <label htmlFor='course_description'>Course Description: </label>
                        <input type='text' name='course_description' placeholder='Course Description' onChange={handleChange} required value={courseData.course_description} />
                    </div>

                    <div className="form-group">
                        <label htmlFor='course_period'>Course Period: </label>
                        <input type='text' name='course_period' placeholder='Course Period' onChange={handleChange} required value={courseData.course_period} />
                    </div>

                    <div className="button-container">
                        <button className='btn btn-success' type='submit'>Update</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CourseUpdate