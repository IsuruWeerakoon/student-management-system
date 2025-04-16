import React from 'react';

function EnrollmentModal(props) {
  return (
    <div className="modal">
      <div className='modal-content-enrolled'>
        <h3>Available Courses</h3>
        <div className="close-container">
          <button className='close-btn' onClick={function () { props.setEnrollmentModal(false) }}>X</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.courses.map(function (course) {
              var isEnrolled = props.enrolledIds.includes(course.id);
              return (
                <tr key={course.id}>
                  <td>{course.course_name}</td>
                  <td>{course.course_description}</td>
                  <td>
                    {isEnrolled ? (
                      <button className='btn btn-delete' onClick={function () { props.handleUnenroll(course.id) }}>Unenroll</button>
                    ) : (
                      <button className='btn btn-success' onClick={function () { props.handleEnroll(course.id) }}>Enroll</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EnrollmentModal;