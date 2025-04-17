import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import API_BASE_URL from './config/apiConfig';
import './App.css';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentRegister from './components/admin_components/StudentRegister';
import ManageStudents from './components/admin_components/ManageStudents';
import ManageCourses from './components/admin_components/ManageCourses';
import ManageEnrollments from './components/admin_components/ManageEnrollments';
import AdminExams from './components/admin_components/AdminExams';
import AdminResults from './components/admin_components/AdminResults';
import TeacherExams from './components/teacher_components/TeacherExams';

function App() {
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(false);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

    useEffect(function () {
        fetchUserRole();
    }, []);

    async function fetchUserRole() {
        try {
            const response = await baseAPI.get('/api/auth/user');
            setUserRole(response.data.role);
        }
        catch (err) {
            console.error('Error fetching user role:', err);
        }
        finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading...</h2>;
    }

    function handleLogin(userData) {
        setUserRole(userData);
    }

    async function handleLogout() {
        try {
            await baseAPI.post('/api/auth/logout', {});
            setUserRole(null);
            window.location.href = '/login';
        }
        catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Router>
            <Routes>
                {/* Redirect Root Path Based on User Role */}
                <Route path="/" element={userRole === 'admin' ? <Navigate to="/admin-dashboard" /> : userRole === 'student' ? <Navigate to="/student-dashboard" /> : <Navigate to="/login" />} />
                
                {/* Login Route - Redirects After Login */}
                <Route path="/login" element={!userRole ? <Login onLogin={handleLogin} /> : <Navigate to={`/${userRole}-dashboard`} />} />
                
                {/* Protected Admin Route */}
                <Route path="/admin-dashboard" element={userRole === 'admin' ? <AdminDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                
                {/* Protected Student Route */}
                <Route path="/student-dashboard" element={userRole === 'student' ? <StudentDashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
                
                {/* Protected Teacher Route */}
                <Route path='/teacher-dashboard' element={userRole === 'teacher' ? <TeacherDashboard onLogout={handleLogout}/> : <Navigate to='/login'/>}/>
                
                {/* Redirect Other Paths */}
                <Route path="*" element={<Navigate to="/login" />} />

                <Route path="/manage_students" element={userRole === 'admin' ? <ManageStudents /> : <Navigate to="/login" />} />
                <Route path="/student_register" element={userRole === 'admin' ? <StudentRegister /> : <Navigate to="/login" />} />
                <Route path="/manage_courses" element={userRole === 'admin' ? <ManageCourses /> : <Navigate to="/login" />} />
                <Route path="/admin/enrollments" element={userRole === 'admin' ? <ManageEnrollments /> : <Navigate to="/login" />} />
                <Route path='/admin/exams' element={userRole === 'admin' ? <AdminExams /> : <Navigate to={'/login'} />} />
                <Route path='/teacher/exams/:courseID' element={userRole === 'teacher' ? <TeacherExams /> : <Navigate to={'/login'} />} />
                <Route path='/admin/results' element={userRole === 'admin' ? <AdminResults /> : <Navigate to={'/login'} />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
                closeButton={false}
                theme="light"
            />

        </Router>
    );
}
export default App;