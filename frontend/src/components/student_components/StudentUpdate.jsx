import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import '../../App.css';

function StudentUpdate() {
    const { studentID } = useParams();
    const [studentData, setStudentData] = useState({ name: '', email: '', phone: '', dob: '', gender: '', city: '', profile: null, role: '' });
    const [showModal, setShowModal] = useState(false);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [profileView, setProfileView] = useState(null);
    const [userRole, setUserRole] = useState([]);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

    useEffect(function () {
        fetchUserData();
        checkUserRole();
    }, []);

    async function fetchUserData() {
        try {
            const response = await baseAPI.get(`/api/students/${studentID}`);
            setStudentData(response.data);
        }
        catch (err) {
            console.error('Error fetching data:', err);
            toast.error(err.response?.data?.message);
        }
    };

    async function checkUserRole() {
        try {
            const response = await baseAPI.get('/api/auth/user');
            if (response.data.role === 'admin') {
                setUserRole(response.data.role);
            }
        }
        catch (err) {
            console.error('Error fetching user role:', err);
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
        formData.append("phone", studentData.phone);
        formData.append("dob", studentData.dob);
        formData.append("gender", studentData.gender);
        formData.append("city", studentData.city);
        formData.append("role", studentData.role);
        if (studentData.profile) {
            formData.append("file", studentData.profile)
        }
        try {
            await baseAPI.put(`/api/students/${studentID}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Student Updated Successfully');
            navigate(-1);
        }
        catch (err) {
            console.error('Error updating data:', err);
            toast.error(err.response?.data?.message);
        }
    };

    function handleDate(DATE) { return DATE.split('T')[0]; };

    function handlePasswordModelChange(e) {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    async function handlePasswordModelUpdate(e) {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.warn('New Passwords do not Match!');
            return;
        }
        try {
            const response = await baseAPI.post(`/api/students/account/${studentID}`, passwords);
            toast.success(response.data.message);
            setShowModal(false);
            if (userRole !== 'admin') {
                await handleLogout();
            }
        }
        catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    async function handleLogout() {
        try {
            await baseAPI.post('/api/auth/logout', {});
            window.location.href = '/login';
        }
        catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div className='model>'>
            <div className="modal-content">
                <div className="close-container">
                    <button className='btn close-btn' onClick={function () { navigate(-1) }}>X</button>
                </div>
                <h2>Student Details Update Form</h2>
                <form onSubmit={handleUpdate}>

                    <div className='profileUpdate'>
                        <img
                            src={API_BASE_URL + '/' + studentData.file_path}
                            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor='name'>Full Name: </label>
                        <input type='text' name='name' placeholder='Full Name' onChange={handleChange} required value={studentData.name} />
                    </div>

                    <div className="form-group">
                        <label htmlFor='email'>Email Address: </label>
                        <input type='email' name='email' placeholder='Email Address' onChange={handleChange} required value={studentData.email} disabled />
                    </div>

                    <div className="form-group">
                        <label htmlFor='phone'>Phone Number: </label>
                        <input type='tel' name='phone' placeholder='Contact Number' onChange={handleChange} required value={studentData.phone} />
                    </div>

                    <div className="form-group">
                        <label htmlFor='dob'>Date of Birth: </label>
                        <input type='date' name='dob' onChange={handleChange} required value={handleDate(studentData.dob)} disabled />
                    </div>

                    <div className="form-group">
                        <label htmlFor='gender'>Gender: </label>
                        <input type='text' name='gender' placeholder='Gender' onChange={handleChange} value={studentData.gender} required disabled />
                    </div>

                    <div className="form-group">
                        <label htmlFor='city'>City: </label>
                        <input type='text' name='city' placeholder='City' onChange={handleChange} required value={studentData.city} />
                    </div>

                    <div>
                        {profileView && (
                            <div className='profileUpdate'>
                                <img
                                    src={profileView}
                                    style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor='profile'>Profile Picture: </label>
                        <input type='file' name='profile' accept='image/*' onChange={handleFileChange} />
                    </div>

                    <div className="form-group">
                        <label htmlFor='role'>User Role: </label>
                        <input type='text' name='role' placeholder='User Role' onChange={handleChange} value={studentData.role} required disabled />
                    </div>

                    <div className="button-container">
                        <button className='btn btn-register' type='button' onClick={function () { setShowModal(true); }}>Change Password</button>
                    </div>

                    <div className="button-container">
                        <button className='btn btn-success' type='submit'>Update</button>
                    </div>
                </form>

                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="close-container">
                                <button className='btn close-btn' onClick={function () { setShowModal(false) }}>X</button>
                            </div>
                            <h2>Change Account Password</h2>
                            <form onSubmit={handlePasswordModelUpdate}>
                                <div className="form-group">
                                    <label htmlFor='currentPassword'>Current Password: </label>
                                    <input type="password" name="currentPassword" placeholder="Current Password" onChange={handlePasswordModelChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor='newPassword'>New Password: </label>
                                    <input type="password" name="newPassword" placeholder="New Password" onChange={handlePasswordModelChange} required />
                                </div>

                                <div className="form-group">
                                    <label htmlFor='confirmNewPassword'>Confirm Password: </label>
                                    <input type="password" name="confirmNewPassword" placeholder="Confirm New Password" onChange={handlePasswordModelChange} required />
                                </div>

                                <div className="button-container">
                                    <button className='btn btn-success' type="submit">Update Password</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentUpdate