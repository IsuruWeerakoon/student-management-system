import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify'
import CourseForm from './CourseForm';

const ManageCourses = function () {
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const [courseModal, setCourseModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [courseByID, setCourseByID] = useState([]);
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    // const [refreshKey, setRefreshKey] = useState(0);

    useEffect(function () {
        fetchCourses();
    }, []);

    function fetchCourses() {
        baseAPI.get(`/api/courses`)
            .then(function (response) {
                setCourses(response.data);
                setFilteredCourses(response.data); // reset filtered list
                setSearchTerm(''); // reset search term
            })
            .catch(function (error) {
                console.error('Error fetching courses:', error);
            });
    };

    function fetchCourseByID(courseID) {
        if (!courseID) return;
        baseAPI.get(`/api/courses/${courseID}`)
            .then(function (response) {
                setCourseByID(response.data);
                setIsEditMode(true); // switch to edit mode
                setCourseModal(true); // open the modal
            })
            .catch(function (err) {
                console.error('Error fetching data:', err);
                toast.error(err.response?.data?.message);
            })
    };

    function handleSearch(event) {
        var value = event.target.value;
        setSearchTerm(value);

        var filtered = courses.filter(function (course) {
            return Object.values(course).some(function (field) {
                return String(field).toLowerCase().includes(value.toLowerCase());
            });
        });
        setFilteredCourses(filtered);
    }

    async function handleDelete(courseID) {
        if (!courseID) return;
        var result = confirm("Are You Sure about Deleting this Record..? " + courseID);
        if (result) {
            baseAPI.delete(`/api/courses/${courseID}`)
                .then(function () {
                    toast.success("Course Deleted Successfully..");
                    fetchCourses();
                })
                .catch(function (err) {
                    console.error('Error deleting item:', err);
                    toast.error(err.response?.data?.message);
                });
        }
    };

    function handleCourseModalChanges(e) {
        setCourseByID({ ...courseByID, [e.target.name]: e.target.value });
    };

    async function handleCourseModal_Add_Update(e) {
        e.preventDefault();
        if (isEditMode) {
            baseAPI.put(`/api/courses/${courseByID.id}`, courseByID)
                .then(function () {
                    toast.success('Course Updated Successfully');
                    fetchCourses(); // refresh data
                })
                .catch(function (err) {
                    toast.error(err.response?.data?.message);
                });
        }
        else {
            baseAPI.post(`/api/courses`, courseByID)
                .then(function () {
                    toast.success('Course Registered Successfully');
                    fetchCourses(); // refresh data
                })
                .catch(function (err) {
                    toast.error(err.response?.data?.message);
                });
        }
        setCourseModal(false);
        setCourseByID({});
        setIsEditMode(false);
        
    };


    return (
        <div className='container'>
            <h3>Manage Courses</h3>
            <div className='button-container'>
                <button className='btn btn-success' onClick={function () { setCourseModal(true); }}>Register a New Course</button>
            </div>
            <input
                type="text"
                placeholder="Search for Courses..."
                value={searchTerm}
                onChange={handleSearch}
                style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
            />

            <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Description</th>
                            <th>Period</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map(function (course) {
                            return (
                                <tr key={course.id}>
                                    <td>{course.course_name}</td>
                                    <td>{course.course_description}</td>
                                    <td>{course.course_period}</td>
                                    <td><button className='btn btn-update' onClick={function () { fetchCourseByID(course.id); setCourseModal(true); }}>Edit</button></td>
                                    <td><button className='btn btn-delete' onClick={function () { handleDelete(course.id) }}>Delete</button></td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {
                courseModal && (
                    <CourseForm
                        courseData={courseByID}
                        handleChange={handleCourseModalChanges}
                        handleSubmit={handleCourseModal_Add_Update}
                        isEditMode={isEditMode}
                        onClose={function () {
                            setCourseModal(false);
                            setCourseByID({});
                            setIsEditMode(false);
                        }}
                    />
                )}
        </div>
    );
};

export default ManageCourses;