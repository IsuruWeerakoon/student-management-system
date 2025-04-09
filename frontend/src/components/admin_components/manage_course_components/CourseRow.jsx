import React from 'react'
import API_BASE_URL from '../../../config/apiConfig'
import { useNavigate } from 'react-router-dom'


function CourseRow({ course, handleDelete }) {
    const navigate = useNavigate();
    return (
        <tr key={course.id}>
            <td>{course.course_name}</td>
            <td>{course.course_description}</td>
            <td>{course.course_period}</td>
            <td><button className='btn btn-update' onClick={function () { navigate(`/course_update/${course.id}`) }}>Edit</button></td>
            <td><button className='btn btn-delete' onClick={function () { handleDelete(course.id) }}>Delete</button></td>
        </tr>
    )
}

export default CourseRow