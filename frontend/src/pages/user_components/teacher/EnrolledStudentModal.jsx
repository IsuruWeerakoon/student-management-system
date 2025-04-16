import React from 'react'

function EnrolledStudentModal(props) {
    return (
        <div className="modal">
            <div className="modal-content-enrolled">
                <h2>Enrolled Students</h2>
                <div className="close-container">
                    <button className='btn close-btn' onClick={function () { props.setStudentModal(false) }}>X</button>
                </div>

                {!props.students.length > 0 ? (<p>No Students Enrolled in this Course</p>) : (
                    <div className='table-container'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Contact Number</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.students.map(function (student) {
                                    return (
                                        <tr key={student.id}>
                                            <td>{student.name}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EnrolledStudentModal