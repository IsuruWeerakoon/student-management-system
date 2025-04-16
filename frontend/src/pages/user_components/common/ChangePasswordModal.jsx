import React from 'react';

function ChangePasswordModal(props) {
  return (
    <div className="modal">
      <div className="modal-content-password">
        <div className="close-container">
          <button className='btn close-btn' onClick={function () { props.setPasswordChangeModal(false) }}>X</button>
        </div>
        <h2>Change Account Password</h2>
        <form onSubmit={props.handlePasswordModelUpdate}>
          <div className="form-group">
            <label>Current Password:</label>
            <input type="password" name="currentPassword" onChange={props.handlePasswordModelChange} required />
          </div>

          <div className="form-group">
            <label>New Password:</label>
            <input type="password" name="newPassword" onChange={props.handlePasswordModelChange} required />
          </div>

          <div className="form-group">
            <label>Confirm Password:</label>
            <input type="password" name="confirmNewPassword" onChange={props.handlePasswordModelChange} required />
          </div>

          <div className="button-container">
            <button className='btn btn-success' type="submit">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;