import React from 'react'
import API_BASE_URL from '../../../config/apiConfig.js'

function StudentModal({studentData, onClose}) {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="close-container">
          <button className='btn close-btn' onClick={onClose}>X</button>
        </div>
        <h2>Registered Student Details</h2>
        <table>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>City</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {
              studentData.length > 0 ? (
                studentData.map(function (student) {
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone}</td>
                      <td>{student.city}</td>
                      <td>
                        <div className='profileView'>
                          <img
                            src={API_BASE_URL + '/' + student.file_path}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7">No Results Found</td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentModal