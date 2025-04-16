import React, { forwardRef } from "react";

const ProfilePanel = forwardRef(function (props, ref) {
  return (
    <div className="profile-panel" ref={ref}>
      <a onClick={props.onViewProfile}>View Profile</a>
      <a onClick={props.onChangePassword}>Change Password</a>
      <a className="logout" onClick={props.onLogout}>Logout</a>
    </div>
  );
});

export default ProfilePanel;