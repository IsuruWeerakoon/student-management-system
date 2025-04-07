import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify'
import '../../App.css';

function CourseEnrollment() {
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const navigate = useNavigate();

    useEffect(function () {
        baseAPI.get('/api/')
            .then(function (res) {
                setCourses(res.data.allCourses);
                const uniqueEnrolled = [...new Set(res.data.enrolledCourseIds)];
                setEnrolledIds(uniqueEnrolled);
            })
            .catch(function (err) {
                console.error(err);
                toast.error(err.response?.data?.message)
            });
    }, []);

    function handleEnroll(courseId) {
        if (enrolledIds.includes(courseId)) {
            return toast.warn('You are already enrolled in this course.');
        }

        baseAPI.post('/api/enroll', { courseId })
            .then(function (res) {
                setEnrolledIds([...enrolledIds, courseId]);
                toast.success("Enrolled in the Course Successfully..");
            })
            .catch(function (err) {
                console.error(err);
                toast.error(err.response?.data?.message);
            });
    }

    function handleUnenroll(courseId) {
        baseAPI.post('/api/unenroll', { courseId })
            .then(function (res) {
                setEnrolledIds(enrolledIds.filter(function (id) { id !== courseId }));
            })
            .catch(function (err) {
                console.error(err);
                toast.error(err.response?.data?.message);
            });
    }

    return (
        <div className='model'>
            <div className="model-content">
                <h2>Available Courses</h2>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.length > 0 && courses.map(function (course) {
                                const isEnrolled = enrolledIds.includes(course.id);
                                return (
                                    <tr key={course.id}>
                                        <td>{course.course_name}</td>
                                        <td>{course.course_description}</td>
                                        <td>{isEnrolled ? (
                                            <button className='btn btn-delete' onClick={function () { handleUnenroll(course.id) }}>
                                                Unenroll
                                            </button>
                                        ) : (
                                            <button className='btn btn-success' onClick={function () { handleEnroll(course.id) }}>
                                                Enroll
                                            </button>
                                        )}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='button-container'>
                    <button className='btn btn-cancel' onClick={function () { navigate('/student-dashboard') }}>Back</button>
                </div>
            </div>
        </div>
    );
}

export default CourseEnrollment;
