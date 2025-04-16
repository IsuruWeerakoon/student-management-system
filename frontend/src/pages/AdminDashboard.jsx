import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import API_BASE_URL from '../config/apiConfig';
import AdminTimetable from '../components/admin_components/AdminTimetable';
import ManageStudents from '../components/admin_components/ManageStudents';
import ManageCourses from '../components/admin_components/ManageCourses';
import AdminExams from '../components/admin_components/AdminExams';
import AdminResults from '../components/admin_components/AdminResults';
import ManageEnrollments from '../components/admin_components/ManageEnrollments';
import ProfilePanel from './user_components/common/ProfilePanel.jsx';
import ChangePasswordModal from './user_components/common/ChangePasswordModal.jsx';
import ProfileModal from './user_components/common/ProfileModal.jsx';
import { handleDate } from '../components/utils.js';

// AdminDashboard Component for Managing Students, Courses, Exams, and Results
const AdminDashboard = function ({ onLogout }) {
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const [activeTab, setActiveTab] = useState('users');
    const [profileModal, setProfileModal] = useState(false);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [adminData, setAdminData] = useState([]);
    const [userRole, setUserRole] = useState([]);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [passwordChangeModal, setPasswordChangeModal] = useState(false);
    const [profileView, setProfileView] = useState(null);
    const panelRef = useRef(null);

    useEffect(function () {
        function handleClickOutside(event) {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setShowSidePanel(false);
            }
        }
        if (showSidePanel) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return function () {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showSidePanel]);

    useEffect(function () {
        verifyUserRole();
    }, []);

    useEffect(function () {
        fetchAdminData();
    }, []);

    async function verifyUserRole() {
        try {
            const response = await baseAPI.get(`/api/auth/user`);
            if (response.data.role !== 'admin') {
                window.location.href = '/login';
            }
            setUserRole(response.data.role);
        }
        catch (err) {
            console.error('Error fetching user role:', err);
        }
    };

    function fetchAdminData() {
        baseAPI.get(`/api/admin/record`)
            .then(function (response) {
                setAdminData(response.data);
            })
            .catch(function (err) {
                console.log(err);
            })
    };

    async function handleUpdate(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", adminData.name);
        formData.append("email", adminData.email);
        formData.append("phone", adminData.phone);
        formData.append("city", adminData.city);
        if (adminData.profile) {
            formData.append("file", adminData.profile)
        }
        try {
            await baseAPI.put(`/api/students/${adminData.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Profile Updated Successfully..');
            setProfileModal(false);
            fetchAdminData();
            setProfileView(null);
        }
        catch (err) {
            console.error('Error updating data:', err);
            toast.error(err.response?.data?.message);
            fetchAdminData();
        }
    };

    async function handlePasswordModelUpdate(e) {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            toast.warn('New Passwords do not Match!');
            return;
        }
        try {
            const response = await baseAPI.post(`/api/students/account/${adminData.id}`, passwords);
            toast.success(response.data.message + " Please Login Now..");
            setPasswordChangeModal(false);
              if (userRole !== '') {
            setTimeout(async function () {
                await onLogout();
            }, 3200);
              }
        }
        catch (error) {
            toast.error(error.response?.data?.message);
        }
    };

    function handleChange(e) {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    function handleFileChange(e) {
        const profileImage = e.target.files[0];
        profilePreview(profileImage);
        setAdminData({ ...adminData, profile: profileImage });
    };

    function profilePreview(profileImage) {
        if (profileImage) {
            const imageURL = URL.createObjectURL(profileImage);
            setProfileView(imageURL);
        }
    };

    function handlePasswordModelChange(e) {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    return (
        <div className='main-container'>
            <div>
                <h3>Welcome <span className='highlight-username'>{adminData.name}</span> to the Dashboard</h3>
                <h1>Admin's Dashboard</h1>

                {!adminData ? (<p>Loading...</p>) : (
                    <div>
                        <div className='profile-container' onClick={function () { setShowSidePanel(!showSidePanel); }}>
                            <img
                                src={API_BASE_URL + '/' + adminData.file_path}
                                className="profile-image"
                            />
                            {showSidePanel && (
                                <ProfilePanel
                                    ref={panelRef}
                                    onViewProfile={function () { setProfileModal(true); }}
                                    onChangePassword={function () { setPasswordChangeModal(true); }}
                                    onLogout={onLogout}
                                />)}
                        </div>
                        <div className="admin-dashboard-topbar">
                            <button className="topbar-button" onClick={function () { setActiveTab('users') }}>
                                Manage Users
                            </button>

                            <button className="topbar-button" onClick={function () { setActiveTab('timetable') }}>
                                Manage Timetables
                            </button>

                            <button className="topbar-button" onClick={function () { setActiveTab('courses') }}>
                                Manage Courses
                            </button>
                            <button className="topbar-button" onClick={function () { setActiveTab('enrollments') }}>
                                Manage Enrollments
                            </button>
                            <button className="topbar-button" onClick={function () { setActiveTab('exams') }}>
                                Manage Exams
                            </button>
                            <button className="topbar-button" onClick={function () { setActiveTab('results') }}>
                                Manage Results
                            </button>
                        </div>

                        <br />

                        <div>
                            {activeTab === 'users' && <ManageStudents />}
                            {activeTab === 'timetable' && <AdminTimetable />}
                            {activeTab === 'courses' && <ManageCourses />}
                            {activeTab === 'enrollments' && <ManageEnrollments />}
                            {activeTab === 'exams' && <AdminExams />}
                            {activeTab === 'results' && <AdminResults />}
                        </div>

                        {profileModal && (
                            <ProfileModal
                                studentData={adminData}
                                profileView={profileView}
                                handleDate={handleDate}
                                handleChange={handleChange}
                                handleFileChange={handleFileChange}
                                handleUpdate={handleUpdate}
                                setProfileModal={setProfileModal}
                                setProfileView={setProfileView}
                            />
                        )}

                        {passwordChangeModal && (
                            <ChangePasswordModal
                                setPasswordChangeModal={setPasswordChangeModal}
                                handlePasswordModelChange={handlePasswordModelChange}
                                handlePasswordModelUpdate={handlePasswordModelUpdate}
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;