import React, { useEffect } from 'react';
import API_BASE_URL from '../../../config/apiConfig';

function ProfileModal(props) {
    useEffect(function(){
        props.setProfileView(null);
    },[]);

  return (
    <div className='modal'>
      <div className='modal-content-profile'>
        <h2>Student Details Update Form</h2>
        <div className="close-container">
          <button className='btn close-btn' onClick={function () { props.setProfileModal(false) }}>X</button>
        </div>
        <form onSubmit={props.handleUpdate}>
          <div className='profileUpdate'>
            <img
              src={API_BASE_URL + '/' + props.studentData.file_path}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>

          <div className="form-group">
            <label>Full Name:</label>
            <input type='text' name='name' value={props.studentData.name} onChange={props.handleChange} required />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type='email' name='email' value={props.studentData.email} onChange={props.handleChange} required />
          </div>

          <div className="form-group">
            <label>Phone:</label>
            <input type='tel' name='phone' value={props.studentData.phone} onChange={props.handleChange} required />
          </div>

          <div className="form-group">
            <label>Date of Birth:</label>
            <input type='date' name='dob' value={props.handleDate(props.studentData.dob)} disabled />
          </div>

          <div className="form-group">
            <label>Gender:</label>
            <input type='text' name='gender' value={props.studentData.gender} disabled />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input type='text' name='city' value={props.studentData.city} onChange={props.handleChange} required />
          </div>

          {props.profileView && (
            <div className='profileUpdate'>
              <img src={props.profileView} style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          )}

          <div className="form-group">
            <label>Profile Picture:</label>
            <input type='file' name='profile' accept='image/*' onChange={props.handleFileChange} />
          </div>

          <div className="form-group">
            <label>Role:</label>
            <input type='text' name='role' value={props.studentData.role} disabled />
          </div>

          <div className="button-container">
            <button type='submit' className='btn btn-success'>Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;