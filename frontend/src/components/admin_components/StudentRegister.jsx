import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import '../../App.css';

function StudentRegister() {
    const [studentData, setStudentData] = useState({ name: '', email: '', phone: '', dob: '', gender: '', city: '', profile: null, password: '', confirmpassword: '', role: '' });
    const [profileView, setProfileView] = useState(null);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

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

    async function handleRegister(e) {
        e.preventDefault();
        if (studentData.password !== studentData.confirmpassword) {
            toast.warn('Passwords do not Match!');
            return;
        }
        const formData = new FormData();
        formData.append("name", studentData.name);
        formData.append("email", studentData.email);
        formData.append("phone", studentData.phone);
        formData.append("dob", studentData.dob);
        formData.append("gender", studentData.gender);
        formData.append("city", studentData.city);
        formData.append("password", studentData.password);
        formData.append("role", studentData.role);
        if (studentData.profile) {
            formData.append("file", studentData.profile)
        }
        try {
            await baseAPI.post('/api/students', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Student Registered Successfully');
            navigate(-1);
        }
        catch (err) {
            console.log(err);
            toast.error(err.response?.data?.message);
        }
    };

    return (
        <div className='modal>'>
            <div className="modal-content">
            <div className="close-container">
                            <button className='btn close-btn' onClick={function () { navigate(-1) }}>X</button>
                        </div>
                <h2>Student Details Registration Form</h2>
                <form onSubmit={handleRegister}>
                    <div className="form-group">
                        <label htmlFor='name'>Full Name: </label>
                        <input type='text' name='name' placeholder='Full Name' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='email'>Email Address: </label>
                        <input type='email' name='email' placeholder='Email Address' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='phone'>Phone Number: </label>
                        <input type='tel' name='phone' placeholder='Contact Number' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='dob'>Date of Birth: </label>
                        <input type='date' name='dob' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='gender'>Gender: </label>
                        <select name='gender' onChange={handleChange} required >
                            <option value="">--Select--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor='city'>City: </label>
                        <input type='text' name='city' placeholder='City' onChange={handleChange} required />
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
                        <label htmlFor='password'>Password: </label>
                        <input type='password' name='password' placeholder='Password' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='confirmpassword'>Confirm Password: </label>
                        <input type='password' name='confirmpassword' placeholder='Confirm Password' onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor='role'>User Role: </label>
                        <select name='role' onChange={handleChange} required >
                            <option value="">--Select--</option>
                            <option value="student">Student</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <div className="button-container">
                        <button className='btn btn-success' type='submit'>Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default StudentRegister