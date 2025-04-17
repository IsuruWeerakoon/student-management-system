import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';
import StudentEnrollmentModal from './StudentEnrollmentModal';

function ManageEnrollments() {
    const baseAPI = axios.create({ 
        baseURL: API_BASE_URL, 
        withCredentials: true 
    });
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const [studentCourses, setStudentCourses] = useState([]);
    const [teacherCourses, setTeacherCourses] = useState([]);
    const [enrolledStudentIds, setEnrolledStudentIds] = useState([]);
    const [enrolledTeacherIds, setEnrolledTeacherIds] = useState([]);
    const [role, setRole] = useState('');
    const [userName, setUserName] = useState('');
    const [enrollmentModal, setEnrollmentModal] = useState(false);

    useEffect(function () {
        baseAPI.get(`/api/admin/students`)
            .then(function (response) {
                setStudents(response.data);
            });
    }, []);

    useEffect(function () {
        baseAPI.get(`/api/admin/teachers`)
            .then(function (response) {
                setTeachers(response.data);
            });
    }, []);

    useEffect(function () {
        if (!selectedStudentId) return;
        baseAPI.get(`/api/admin/student-courses/${selectedStudentId}`)
            .then(function (response) {
                setStudentCourses(response.data.allCourses);
                setEnrolledStudentIds(response.data.enrolledCourseIds);
            });
    }, [selectedStudentId]);

    useEffect(function () {
        if (!selectedTeacherId) return;
        baseAPI.get(`/api/admin/teacher-courses/${selectedTeacherId}`)
            .then(function (response) {
                setTeacherCourses(response.data.allCourses);
                setEnrolledTeacherIds(response.data.enrolledCourseIds);
            });
    }, [selectedTeacherId]);


    async function handleEnroll(courseId, courseName) {
        if (!selectedStudentId) {
            return;
        }
        if (enrolledStudentIds.includes(courseId)) {
            return toast.warn('Already enrolled');
        }
        try {
            await baseAPI.post(`/api/admin/enroll`, { studentId: selectedStudentId, courseId });
            setEnrolledStudentIds([...enrolledStudentIds, courseId]);
            toast.success(`${userName} has been enrolled in ${courseName}.`);
        }
        catch (err) {
            toast.error(`Failed to enroll ${userName} in ${courseName}. Please try again.`);
        }
    }

    async function handleUnenroll(courseId, courseName) {
        try {
            await baseAPI.post(`/api/admin/unenroll`, { studentId: selectedStudentId, courseId });
            setEnrolledStudentIds(enrolledStudentIds.filter(function (id) { return id !== courseId; }));
            toast.info(`${userName} has been unenrolled from ${courseName}.`);
        }
        catch (err) {
            toast.error(`Failed to unenroll ${userName} from ${courseName}. Please try again.`);
        }
    }

    async function handleAssign(courseId, courseName) {
        if (!selectedTeacherId) {
            return;
        }
        if (enrolledTeacherIds.includes(courseId)) {
            return toast.warn('Already Assigned');
        }
        try {
            await baseAPI.post(`/api/admin/assign`, { teacherId: selectedTeacherId, courseId });
            setEnrolledTeacherIds([...enrolledTeacherIds, courseId]);
            toast.success(`${userName} has been assigned to ${courseName}.`);
        }
        catch (err) {
            toast.error(`Failed to assign ${userName} in ${courseName}. Please try again.`);
        }
    }

    async function handleUnassign(courseId, courseName) {
        try {
            await baseAPI.post(`/api/admin/unassign`, { teacherId: selectedTeacherId, courseId });
            setEnrolledTeacherIds(enrolledTeacherIds.filter(function (id) { return id !== courseId; }));
            toast.info(`${userName} has been unassigned from ${courseName}.`);
        }
        catch (err) {
            toast.error(`Failed to unassign ${userName} from ${courseName}. Please try again.`);
        }
    }


    return (
        <div className='container'>
            <h2>Enroll Students in Courses</h2>
            <div className='form-group'>
                <label>Select Student: </label>
                <select onChange={function (e) {
                    setSelectedStudentId(e.target.value);
                    setRole('student');
                    setEnrollmentModal(true);
                    students.find(function (t) {
                        if (t.id === Number(e.target.value)) {
                            setUserName(t.name);
                        }
                    })

                }}
                    value={selectedStudentId || ''
                    }>

                    <option value="" disabled>Select a Student</option>
                    {students.length > 0 && students.map(function (student) {
                        return (
                            <option key={student.id} value={student.id}>
                                {student.name} ({student.email})
                            </option>
                        )
                    })}
                </select>
            </div>
            <br />
            <h2>Assign Teachers to Courses</h2>
            <div className='form-group'>
                <label>Select Teacher: </label>
                <select onChange={function (e) {
                    setSelectedTeacherId(e.target.value);
                    setRole('teacher');
                    setEnrollmentModal(true);
                    teachers.find(function (t) {
                        if (t.id === Number(e.target.value)) {
                            setUserName(t.name);
                        }
                    })
                }}
                    value={selectedTeacherId || ''
                    }>

                    <option value="" disabled>Select a Teacher</option>
                    {teachers.length > 0 && teachers.map(function (teacher) {
                        return (
                            <option key={teacher.id} value={teacher.id}>
                                {teacher.name} ({teacher.email})
                            </option>
                        )
                    })}
                </select>
            </div>

            {enrollmentModal && (
                <StudentEnrollmentModal
                    courses={role === 'student' ? studentCourses : teacherCourses}
                    handleAssignments={role === 'student' ? handleEnroll : handleAssign}
                    handleUnassignments={role === 'student' ? handleUnenroll : handleUnassign}
                    enrolledIds={role === 'student' ? enrolledStudentIds : enrolledTeacherIds}
                    onClose={function () {
                        setEnrollmentModal(false);
                        setRole('');
                        setSelectedStudentId('');
                        setSelectedTeacherId('');
                        setUserName('');
                    }}
                    role={role}
                    name={userName}
                />
            )}
        </div>
    );
}

export default ManageEnrollments;