import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import API_BASE_URL from '../config/apiConfig';
import { toast } from 'react-toastify';
import '../App.css';
// AdminDashboard Component for Managing Students, Courses, Exams, and Results
const AdminDashboard = function ({ onLogout }) {
    const navigate = useNavigate();
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

    useEffect(function () {
        verifyUserRole();
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
        }
    };

    function goToManageStudents() { navigate('/manage_students'); };
    function goToManageCourses() { navigate('/manage_courses'); };
    function goToManageEnrollments() { navigate('/admin/enrollments'); };
    function goToManageExams() { navigate('/admin/exams'); };
    function goToManageResults() { navigate('/admin/results'); };


    return (
        <div className='container'>
            <button className='logout-button' onClick={onLogout}> <FiLogOut size={18} />Logout</button>
            <div>
                <h1>Admin Dashboard</h1>

                <div className='button-container'>
                    <button className='btn btn-register' onClick={goToManageStudents}>Manage Students</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-success' onClick={goToManageCourses}>Manage Courses</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-register' onClick={goToManageEnrollments}>Manage Enrollments</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-success' onClick={goToManageExams}>Manage Exams</button>
                </div>

                <div className='button-container'>
                    <button className='btn btn-register' onClick={goToManageResults}>Manage Results</button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;