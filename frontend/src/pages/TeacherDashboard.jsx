import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

import API_BASE_URL from '../config/apiConfig.js'
import ProfileModal from './user_components/common/ProfileModal.jsx';
import ChangePasswordModal from './user_components/common/ChangePasswordModal.jsx';
import ProfilePanel from './user_components/common/ProfilePanel.jsx';
import EnrolledStudentModal from './user_components/teacher/EnrolledStudentModal.jsx';
import MessageReplyModal from './user_components/teacher/MessageReplyModal.jsx';
import { handleDate } from '../components/utils.js';

const TeacherDashboard = function ({ onLogout }) {
  const baseAPI = axios.create({ 
    baseURL: API_BASE_URL, 
    withCredentials: true 
  });
  const [teacherID, setTeacherID] = useState(null);
  const navigate = useNavigate();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const [teacherData, setTeacherData] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [timetable, setTimetable] = useState([]);
  const [profileView, setProfileView] = useState(null);
  const [userRole, setUserRole] = useState([]);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const [studentModal, setStudentModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [passwordChangeModal, setPasswordChangeModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const timeSlots = [
    { label: "1st Period", start_time: "07:50", end_time: "08:30" },
    { label: "2nd Period", start_time: "08:30", end_time: "09:10" },
    { label: "3rd Period", start_time: "09:10", end_time: "09:50" },
    { label: "4th Period", start_time: "09:50", end_time: "10:30" },
    { label: "5th Period", start_time: "10:50", end_time: "11:30" },
    { label: "6th Period", start_time: "11:30", end_time: "12:10" },
    { label: "7th Period", start_time: "12:10", end_time: "12:50" },
    { label: "8th Period", start_time: "12:50", end_time: "13:30" },
  ];

  const panelRef = useRef(null);

  useEffect(function () {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowSidePanel(false);
      }
    }
    if (showSidePanel) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return function () {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidePanel]);

  useEffect(function () {
    baseAPI.get(`/api/auth/user`)
      .then(function (response) {
        if (response.data.role === 'teacher') {
          setTeacherID(response.data.id);
          setUserRole(response.data.role);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }, []);

  useEffect(function () {
    fetchTeacherData();
  }, []);

  useEffect(function () {
    if (!teacherID) return;
    baseAPI.get(`/api/teacher/courses/${teacherID}`)
      .then(function (response) {
        setCourses(response.data);
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [teacherID]);

  useEffect(function () {
    if (!teacherID) return;
    baseAPI.get(`/api/messages/unread-count/${teacherID}`)
      .then(function (res) {
        setUnreadCount(res.data.unreadCount);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, [teacherID]);

  useEffect(function () {
    if (!teacherID) return;
    baseAPI.get(`/api/teacher/timetable/${teacherID}`)
      .then(function (res) {
        setTimetable(res.data)
      })
      .catch(function (err) {
        console.error(err)
      });
  }, [teacherID]);

  function fetchTeacherData() {
    baseAPI.get(`/api/teacher/record`)
      .then(function (response) {
        setTeacherData(response.data);
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  async function fetchEnrolledStudents(courseID) {
    try {
      const response = await baseAPI.get(`/api/teacher/students/${courseID}`);
      setStudents(response.data);
    }
    catch (err) {
      console.error(err)
    }
  }

  async function fetchMessages() {
    try {
      if (!teacherID) return;
      const response = await baseAPI.get(`/api/messages/teacher/${teacherID}`);
      setMessages(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  function getClassAt(day, time) {
    const slot = timetable.find(function (item) {
      return item.day_of_week === day && item.start_time.startsWith(time);
    });
    if (slot) {
      return `${slot.course_name} (${slot.room})`;
    }
    return null;
  };

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", teacherData.name);
    formData.append("email", teacherData.email);
    formData.append("phone", teacherData.phone);
    formData.append("city", teacherData.city);
    if (teacherData.profile) {
      formData.append("file", teacherData.profile)
    }
    try {
      await baseAPI.put(`/api/students/${teacherID}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile Updated Successfully..');
      setProfileModal(false);
      fetchTeacherData();
      setProfileView(null);
    }
    catch (err) {
      console.error('Error updating data:', err);
      toast.error(err.response?.data?.message);
      fetchTeacherData();
    }
  };

  async function handlePasswordModelUpdate(e) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.warn('New Passwords do not Match!');
      return;
    }
    try {
      const response = await baseAPI.post(`/api/students/account/${teacherID}`, passwords);
      toast.success(response.data.message + " Please Login Now..");
      setPasswordChangeModal(false);
      if (userRole !== 'admin') {
        setTimeout(async function () {
          await onLogout();
        }, 3100);
      }
    }
    catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  function handleChange(e) {
    setTeacherData({ ...teacherData, [e.target.name]: e.target.value });
  };

  function handleFileChange(e) {
    const profileImage = e.target.files[0];
    profilePreview(profileImage);
    setTeacherData({ ...teacherData, profile: profileImage });
  };

  function profilePreview(profileImage) {
    if (profileImage) {
      const imageURL = URL.createObjectURL(profileImage);
      setProfileView(imageURL);
    }
  };

  function handlePasswordModelChange(e) {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  function handleReplySubmit(e, messageId) {
    e.preventDefault();
    const replyText = e.target.reply.value;
    baseAPI.post(`/api/messages/reply/${messageId}`, {
        reply: replyText,
      })
      .then(function () {
        toast.success("Reply Sent..");
        return fetchMessages();
      })
      .then(function (res) {
        setMessages(res.data);
        e.target.reset();
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome <span className="highlight-username">{teacherData.name}</span> to the Teacher's Dashboard</h2>

      <div className="notification-badge">
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      {teacherData ? (
        <div>
          <div className='profile-container' onClick={function () { setShowSidePanel(!showSidePanel); }}>
            <img
              src={API_BASE_URL + '/' + teacherData.file_path}
              className="profile-image"
            />
            {showSidePanel && (
              <ProfilePanel
                ref={panelRef}
                onViewProfile={function () { setProfileModal(true); }}
                onChangePassword={function () { setPasswordChangeModal(true); }}
                onLogout={onLogout}
              />)}
          </div>
          <div className='admin-dashboard-topbar'>
            <button className='topbar-button' onClick={function () { setMessageModal(true); fetchMessages() }}>My Messages</button>
          </div>

          <h3>My TimeTable</h3>
          <div className="timetable-container">
            <table className="timetable-grid">
              <thead>
                <tr>
                  <th>Time</th>
                  {days.map(function (day) { return (<th key={day}>{day}</th>) })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(function (slot) {
                  return (
                    <tr key={slot.start_time}>
                      <td>
                        {slot.label} <br />
                        <span className="time">{slot.start_time} - {slot.end_time}</span>
                      </td>
                      {days.map(function (day) {
                        const classText = !slot.isBreak ? getClassAt(day, slot.start_time) : null;
                        return (
                          <td key={day + slot.start_time} className={classText ? 'occupied' : slot.isBreak ? 'break' : ''}>
                            {classText || (slot.isBreak ? '—' : '')}
                          </td>
                        );
                      })}
                    </tr>
                  )
                })}
              </tbody>

            </table>
          </div>

          <br />
          <hr />

          <h3>My Courses</h3>
          {courses.length === 0 ? (<p>No Courses Assigned Yet</p>) : (
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(function (course) {
                    return (
                      <tr key={course.id}>
                        <td>{course.course_name}</td>
                        <td>{course.course_description}</td>
                        <td>
                          <button className='btn btn-success' onClick={function () { setStudentModal(true); fetchEnrolledStudents(course.id) }}>Enrolled Students</button>
                          <button className='btn btn-success' onClick={function () { navigate('/teacher/exams/' + course.id) }}>Manage My Exams</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {studentModal && (
            <EnrolledStudentModal
              students={students}
              setStudentModal={setStudentModal}
            />
          )}

          {messageModal && (
            <MessageReplyModal
              messages={messages}
              setMessageModal={setMessageModal}
              onReplySubmit={handleReplySubmit}
            />
          )}

          {profileModal && (
            <ProfileModal
              studentData={teacherData}
              profileView={profileView}
              handleDate={handleDate}
              handleChange={handleChange}
              handleFileChange={handleFileChange}
              handleUpdate={handleUpdate}
              setProfileModal={setProfileModal}
              setProfileView={setProfileView}
            />
          )}

          {passwordChangeModal && (
            <ChangePasswordModal
              setPasswordChangeModal={setPasswordChangeModal}
              handlePasswordModelChange={handlePasswordModelChange}
              handlePasswordModelUpdate={handlePasswordModelUpdate}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )
      }
    </div >
  )
}

export default TeacherDashboard;