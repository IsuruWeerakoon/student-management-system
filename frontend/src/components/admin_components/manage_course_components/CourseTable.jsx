import React from 'react'
import CourseRow from './CourseRow'

function CourseTable({ courseData, handleDelete }) {
    if (courseData.length === 0) {
        return (
            <tr>
                <td colSpan='5'>No Results Found</td>
            </tr>
        )
    }
    else {
        return (
            <>
                {courseData.map(function (course) {
                    return (<CourseRow key={course.id} course={course} handleDelete={handleDelete} />)
                })}
            </>
        )
    }
}

export default CourseTable