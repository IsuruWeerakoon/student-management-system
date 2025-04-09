import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import '../../App.css';
import StudentTable from './manage_students_components/StudentTable';
import StudentModal from './manage_students_components/StudentModal';
import SearchInput from './manage_students_components/SearchInput';

const ManageStudents = function () {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [studentData, setStudentData] = useState([]);
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

    async function viewStudents() {
        try {
            const response = await baseAPI.get('/api/students');
            setStudentData(response.data);
        }
        catch (err) {
            console.log(err);
        }
    };

    async function handleSearch() {
        var search = searchParams.get('search') || '';
        setSearchTerm(search);
        if (!search || search.trim() === '') {
            setStudentData([]);
            return;
        }
        try {
            const response = await baseAPI.get('/api/students/search?search=' + search);
            setStudentData(Array.isArray(response.data) ? response.data : []);
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

    async function handleDelete(studentID) {
        var result = confirm("Are You Sure about Deleting this Record..?");
        if (result) {
            try {
                await baseAPI.delete(`/api/students/${studentID}`);
                toast.success("Student Record Deleted Successfully..");
            }
            catch (err) {
                console.error('Error deleting item:', err);
                toast.error(err.response?.data?.message);
            }
        }
    };

    function goToStudentRegister() { navigate('/student_register'); };

    function goBack() { navigate('/admin-dashboard'); };

    return (
        <div className='container'>
            <div>
                <h1>Admin Dashboard</h1>
                <h3>Manage Students</h3>

                <div className='table-container'>
                    <div className='button-container'>
                        <button className='btn btn-cancel' onClick={goBack}>Back</button>
                    </div>

                    <div className='button-container'>
                        <button className='btn btn-update' type='button' onClick={function () { viewStudents(); setShowModal(true); }}>View All Students</button>
                    </div>

                    <div className='button-container'>
                        <button className='btn btn-success' onClick={goToStudentRegister}>Register a New Student</button>
                    </div>
                </div>
            </div>
            <SearchInput value={searchTerm} onChange={handleChange}/>
            <div className="table-container">
                {
                    searchTerm.trim() !== '' ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                    <th>City</th>
                                    <th>Profile</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <StudentTable studentData={studentData} handleDelete={handleDelete} />
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>
                            Start typing to Search for Students...
                        </div>
                    )
                }
            </div>

            {showModal && (
                <StudentModal studentData={studentData} onClose={function () { setShowModal(false) }} />
            )}
        </div>
    );
};

export default ManageStudents;