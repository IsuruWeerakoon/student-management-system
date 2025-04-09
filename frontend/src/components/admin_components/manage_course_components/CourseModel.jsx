import React from 'react'

function CourseModel(courseData, onClose) {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="close-container">
                    <button className='btn close-btn' onClick={onClose}>X</button>
                </div>
                <h2>Registered Course Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Course Description</th>
                            <th>Course Period</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            courseData.length > 0 ? (
                                courseData.map(function (data) {
                                    return (
                                        <tr key={data.id}>
                                            <td>{data.course_name}</td>
                                            <td>{data.course_description}</td>
                                            <td>{data.course_period}</td>
                                        </tr>)
                                })
                            ) : (
                                <tr>
                                    <td colSpan="3">No Results Found</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CourseModel