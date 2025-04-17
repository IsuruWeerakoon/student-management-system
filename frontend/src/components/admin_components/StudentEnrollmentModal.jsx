import React from 'react'

function StudentEnrollmentModal(props) {
    return (
        <div className="modal">
            <div className="modal-content-enrolled">
                <div className="close-container">
                    <button className='btn close-btn' onClick={props.onClose}>X</button>
                </div>
                <div className="table-container">
                    <h3>
                        {
                            props.role === 'student' ?
                                <>Enroll <span className='highlight-name'>{props.name}</span> in Courses</> :
                                <>Assign <span className='highlight-name'>{props.name}</span> to Courses</>
                        }
                    </h3>

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
                                props.courses.length > 0 && props.courses.map(function (course) {
                                    const isEnrolled = props.enrolledIds.includes(course.id);
                                    return (
                                        <tr key={course.id}>
                                            <td>{course.course_name}</td>
                                            <td>{course.course_description}</td>
                                            <td>{isEnrolled ? (
                                                <button className='btn btn-delete' 
                                                onClick={function () { props.handleUnassignments(course.id, course.course_name) }}>
                                                    {props.role === 'student' ? 'Unenroll' : 'Unassign'}
                                                </button>
                                            ) : (
                                                <button className='btn btn-success' 
                                                onClick={function () { props.handleAssignments(course.id, course.course_name) }}>
                                                    {props.role === 'student' ? 'Enroll' : 'Assign'}
                                                </button>
                                            )}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default StudentEnrollmentModal