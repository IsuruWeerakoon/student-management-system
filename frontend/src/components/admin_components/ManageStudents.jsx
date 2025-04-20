import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import ProfileModal from '../../pages/user_components/common/ProfileModal.jsx';
import { handleDate } from '../utils.js';
import socket from '../../config/socket.js';

const ManageStudents = function () {
    const baseAPI = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true
    });
    const [studentData, setStudentData] = useState({ name: '', email: '', phone: '', dob: '', gender: '', city: '', profile: null, role: '' });
    const [profileView, setProfileView] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [profileModal, setProfileModal] = useState(false);
    const [studentId, setStudentId] = useState(null);
    const navigate = useNavigate();

    useEffect(function () {
        fetchUsers();
        function handleUserChange() { fetchUsers() }
        socket.on('studentChange', handleUserChange);
        return function () { socket.off('studentChange', handleUserChange); }
    }, [refreshKey]);

    function fetchUsers() {
        baseAPI.get(`/api/students`)
            .then(function (response) {
                setAllUsers(response.data);
                setFilteredUsers(response.data);
                setSearchTerm('');
            })
            .catch(function (error) {
                console.error('Error loading users:', error);
            });
    }

    function handleSearch(event) {
        var value = event.target.value;
        setSearchTerm(value);
        var filtered = allUsers.filter(function (user) {
            return Object.values(user).some(function (field) {
                return String(field).toLowerCase().includes(value.toLowerCase());
            });
        });
        setFilteredUsers(filtered);
    }

    async function handleDelete(userID, userName) {
        var result = confirm(`Are You Sure about Deleting ${userName}..?`);
        if (result) {
            try {
                await baseAPI.delete(`/api/students/${userID}`);
                toast.info(`${userName} has been Deleted..`);
                setRefreshKey(function (prev) { return prev + 1; });
            }
            catch (err) {
                console.error('Error deleting item:', err);
                toast.error(err.response?.data?.message);
            }
        }
    };

    function goToRegister() {
        navigate('/student_register');
    };

    async function fetchUserData(studentID) {
        try {
            if (!studentID) return;
            setStudentId(studentID);
            const response = await baseAPI.get(`/api/students/${studentID}`);
            setStudentData(response.data);
        }
        catch (err) {
            console.error('Error fetching data:', err);
            toast.error(err.response?.data?.message);
        }
    };


    function handleChange(e) {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
    };

    function handleFileChange(e) {
        const profileImage = e.target.files[0];
        profilePreview(profileImage);
        setStudentData({ ...studentData, profile: profileImage });
    };

    function profilePreview(profileImage) {
        if (profileImage) {
            const imageURL = URL.createObjectURL(profileImage);
            setProfileView(imageURL);
        }
    };

    async function handleUpdate(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", studentData.name);
        formData.append("email", studentData.email);
        formData.append("phone", studentData.phone);
        formData.append("city", studentData.city);
        if (studentData.profile) {
            formData.append("file", studentData.profile)
        }
        try {
            await baseAPI.put(`/api/students/${studentId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Profile Updated Successfully..');
            setProfileModal(false);
            fetchUsers();
        }
        catch (err) {
            console.error('Error updating data:', err);
            toast.error(err.response?.data?.message);

        }
    };



    return (
        <div className='container'>
            <h2>Manage Users</h2>
            <div className='button-container'>
                <button className='btn btn-success' onClick={goToRegister}>Register a New User</button>
            </div>
            <input
                type="text"
                placeholder="Search for Users..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
            />
            <div>
                <div className="table-container">
                    <table >
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>City</th>
                                <th>Role</th>
                                <th>Profile</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredUsers.length > 0 ? (
                                    filteredUsers.map(function (user) {
                                        if (user.role !== 'admin') {
                                            return (
                                                <tr key={user.id}>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.city}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <img
                                                            src={API_BASE_URL + '/' + user.file_path}
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-update" onClick={function () { setProfileModal(true); fetchUserData(user.id); }}>Edit</button>
                                                        <button className="btn btn-delete" onClick={function () { handleDelete(user.id, user.name); }}>Delete</button>
                                                    </td>
                                                </tr>
                                            )
                                        };
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6">No records available...</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div >
                {profileModal && (
                    <ProfileModal
                        studentData={studentData}
                        profileView={profileView}
                        handleDate={handleDate}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        handleUpdate={handleUpdate}
                        setProfileModal={setProfileModal}
                        setProfileView={setProfileView}
                    />
                )}
            </div>
        </div >
    );
};
export default ManageStudents;