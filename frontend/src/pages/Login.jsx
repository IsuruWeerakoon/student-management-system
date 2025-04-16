import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import { toast } from 'react-toastify';

const Login = function ({ onLogin }) {
    const [userCredentials, setUserCredentials] = useState([]);
    const navigate = useNavigate();
    const baseAPI = axios.create({baseURL: API_BASE_URL,withCredentials: true});

    function handleChange(e) {
        setUserCredentials({ ...userCredentials, [e.target.name]: e.target.value });
    };

    async function handleLogin(e) {
        e.preventDefault();
        try {
            const response = await baseAPI.post(`/api/auth/login`, userCredentials);
            if (response.status === 200) {
                getUserRole(); 
            }
        }
        catch (err) {
            toast.error(err.response.data.message);
        }
    };

    async function getUserRole() {
        try {
            const response = await baseAPI.get(`/api/auth/user`);
            onLogin(response.data.role);
            if (response.data.role === 'admin') {
                navigate('/admin-dashboard');
            }
            else if(response.data.role === 'teacher'){
                navigate('/teacher-dashboard');
            }
            navigate('/student-dashboard');
        }
        catch (err) {
            console.error('Error fetching user role:', err);
        }
    };

    return (
        <div className="modal">
            <div className="modal-login">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
                    <div className='form-group'>
                        <input type="email" name='email' placeholder='Email Address' onChange={handleChange} required />
                    </div>
                    <div className='form-group'>
                        <input type="password" name='password' placeholder='Password' onChange={handleChange} required />
                    </div>
                    <div className="button-container">
                        <button className='btn btn-success' type="submit">Login</button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default Login;