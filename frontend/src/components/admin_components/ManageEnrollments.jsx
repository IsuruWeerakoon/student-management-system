import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';

function ManageEnrollments() {
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

    useEffect(function () {
        baseAPI.get(`/api/admin/students`)
            .then(function (response) {
                setStudents(response.data);
            });
    }, []);

    useEffect(function () {
        if (!selectedStudentId) return;
        baseAPI.get(`/api/admin/student-courses/${selectedStudentId}`)
            .then(function (response) {
                setCourses(response.data.allCourses);
                setEnrolledIds(response.data.enrolledCourseIds);
            });
    }, [selectedStudentId]);

    function handleEnroll(courseId) {
        if (!selectedStudentId) {
            return;
        }
        if (enrolledIds.includes(courseId)) {
            return toast.warning('Already enrolled');
        }
        baseAPI.post(`/api/admin/enroll`, { studentId: selectedStudentId, courseId })
            .then(function () {
                setEnrolledIds([...enrolledIds, courseId]);
                toast.success("Enrolled in the Course Successfully...")
            });
    }

    function handleUnenroll(courseId) {
        baseAPI.post(`/api/admin/unenroll`, { studentId: selectedStudentId, courseId })
            .then(function () {
                setEnrolledIds(enrolledIds.filter(function (id) { return id !== courseId; }));
                toast.success("Unenrolled from the Course Successfully..")
            });
    }

    return (
        <div className='container'>
            <h3>Manage Student Enrollments</h3>
            <div className='form-group'>
                <label>Select Student: </label>
                <select onChange={function (e) { setSelectedStudentId(e.target.value) }} value={selectedStudentId || ''}>
                    <option value="" disabled>Select a student</option>
                    {students.length > 0 && students.map(function (student) {
                        return (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.email})
                            </option>
                        )
                    })}
                </select>
            </div>

            {selectedStudentId && (
                <div className="table-container">
                    <h3>Available Courses</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Course Name</th>
                                <th>Course Description</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courses.length > 0 && courses.map(function (course) {
                                    const isEnrolled = enrolledIds.includes(course.id);
                                    return (
                                        <tr key={course.id}>
                                            <td>{course.course_name}</td>
                                            <td>{course.course_description}</td>
                                            <td>{isEnrolled ? (
                                                <button className='btn btn-delete' onClick={function () { handleUnenroll(course.id) }}>Unenroll</button>
                                            ) : (
                                                <button className='btn btn-success' onClick={function () { handleEnroll(course.id) }}>Enroll</button>
                                            )}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ManageEnrollments;