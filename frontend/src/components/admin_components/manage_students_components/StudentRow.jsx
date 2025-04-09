import React from 'react'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../../../config/apiConfig.js'

function StudentRow({ student, handleDelete }) {
  const navigate = useNavigate();
  return (
    <tr key={student.id}>
      <td>{student.name}</td>
      <td>{student.email}</td>
      <td>{student.phone}</td>
      <td>{student.city}</td>
      <td>
        <div className='profileView'>
          <img src={API_BASE_URL + '/' + student.file_path}
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
          />
        </div>
      </td>
      <td><button className='btn btn-update' onClick={function () { navigate(`/student_update/${student.id}`) }}>Edit</button></td>
      <td><button className='btn btn-delete' onClick={function () { handleDelete(student.id) }}>Delete</button></td>
    </tr>
  )
}

export default StudentRow