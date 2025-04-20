import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import ProfileModal from './user_components/common/ProfileModal.jsx';
import ChangePasswordModal from './user_components/common/ChangePasswordModal.jsx';
import MessageTeacherModal from './user_components/student/MessageTeacherModal.jsx';
import ViewAllMessagesModal from './user_components/student/ViewAllMessagesModal.jsx';
import EnrollmentModal from './user_components/student/EnrollmentModal.jsx';
import ProfilePanel from './user_components/common/ProfilePanel.jsx';
import { isPastExam, getDaysRemaining, handleDate } from '../components/utils.js'

import API_BASE_URL from '../config/apiConfig';
import socket from '../config/socket.js';

// StudentDashboard Component for Viewing Courses, Exams, and Results
const StudentDashboard = function ({ onLogout }) {
  const baseAPI = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
  });
  const [studentData, setStudentData] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

  const [messageText, setMessageText] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [teacherList, setTeacherList] = useState([]);
  const [myMessages, setMyMessages] = useState([]);
  const [profileView, setProfileView] = useState(null);
  const [userRole, setUserRole] = useState([]);

  const [viewAllMessagesModal, setViewAllMessagesModal] = useState(false);
  const [messageModal, setMessageModal] = useState(false);
  const [enrollmentModal, setEnrollmentModal] = useState(false);
  const [passwordChangeModal, setPasswordChangeModal] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);

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
        setUserRole(response.data.role);
        setStudentId(response.data.id);
      })
      .catch(function (err) {
        console.error('Error fetching user role:', err);
      });
  }, []);

  useEffect(function () {
    fetchAllCourse();
    function handleCourseChange() { fetchAllCourse(); };
    socket.on('courseChange', handleCourseChange);
    return function () { socket.off('courseChange', handleCourseChange); };
  }, [enrolledIds]);

  function fetchAllCourse() {
    baseAPI.get(`/api/`)
      .then(function (res) {
        setCourses(res.data.allCourses);
        const uniqueEnrolled = [...new Set(res.data.enrolledCourseIds)];
        setEnrolledIds(uniqueEnrolled);
      })
      .catch(function (err) {
        console.error(err);
        toast.error(err.response?.data?.message)
      });
  }

  useEffect(function () {
    fetchStudentData();
    function handleUserChange() { fetchStudentData() }
    socket.on('studentChange', handleUserChange);
    return function () { socket.off('studentChange', handleUserChange); }
  }, [studentId]);

  function fetchMessages() {
    if (!studentId) return; // wait until we have studentId
    baseAPI.get(`/api/messages/student/${studentId}`)
      .then(function (res) {
        setMyMessages(res.data);
      })
      .catch(function (err) {
        console.error(err)
      });
  }

  useEffect(function () {
    fetchMessageCount();
    function handleMessageChange() { fetchMessageCount(); };
    socket.on('newMessage', handleMessageChange);
    return function () { socket.off('newMessage', handleMessageChange); };
  }, [studentId]);

  function fetchMessageCount() {
    if (!studentId) return;
    console.log(studentId);
    baseAPI.get(`/api/messages/unread-student-count/${studentId}`)
      .then(function (res) {
        setUnreadCount(res.data.unreadCount);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  useEffect(function () {
    fetchMyExams();
    function handleExamChange() { fetchMyExams(); };
    socket.on('examChange', handleExamChange);
    return function () { socket.off('examChange', handleExamChange); };
  }, []);

  function fetchMyExams() {
    baseAPI.get(`/api/exams/studentdata`)
      .then(function (res) {
        const sortedExams = res.data.sort(function (a, b) {
          return new Date(a.exam_date) - new Date(b.exam_date);
        });
        setExams(sortedExams);
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  useEffect(function () {
    fetchMyResults();
    function handleResultChange() { fetchMyResults(); };
    socket.on('resultChange', handleResultChange);
    return function () { socket.off('resultChange', handleResultChange); };
  }, []);

  function fetchMyResults() {
    baseAPI.get(`/api/results/student`)
      .then(function (res) {
        setResults(res.data)
      });
  };

  useEffect(function () {
    fetchTeachers();
    function handleTeacherChange() { fetchTeachers() };
    socket.on('studentChange', handleTeacherChange);
    return function () { socket.off('studentChange', handleTeacherChange); }
  }, []);

  function fetchTeachers() {
    baseAPI.get(`/api/teachers`)
      .then(function (res) {
        setTeacherList(res.data)
      })
      .catch(function (err) {
        console.error('Failed to load teacher list:', err)
      });
  }

  async function fetchStudentData() {
    try {
      const response = await baseAPI.get(`/api/students/record`);
      setStudentData(response.data);
    }
    catch (err) {
      console.error('Error fetching data:', err);
      toast.error(err.response?.data?.message);
    }
  };
  
  function handleEnroll(courseId) {
    if (enrolledIds.includes(courseId)) {
      return toast.warn('Already enrolled in this course.');
    }
    baseAPI.post(`/api/enroll`, { courseId })
      .then(function (res) {
        setEnrolledIds([...enrolledIds, courseId]);
        toast.success("Enrolled in the Course Successfully..");
      })
      .catch(function (err) {
        console.error(err);
        toast.error(err.response?.data?.message);
      });
  }

  function handleUnenroll(courseId) {
    baseAPI.post(`/api/unenroll`, { courseId })
      .then(function (res) {
        setEnrolledIds(enrolledIds.filter(function (id) { id !== courseId }));
      })
      .catch(function (err) {
        console.error(err);
        toast.error(err.response?.data?.message);
      });
  }

  function handleSendMessage(e) {
    e.preventDefault();
    baseAPI.post(`/api/messages/send`, {
      sender_id: studentId, // from login session
      receiver_id: teacherId,
      sender_role: 'student',
      message: messageText
    })
      .then(function () {
        toast.success('Message Sent..');
        setMessageText('');
        setMessageModal(false);
        // fetchMessages();
      })
      .catch(function (err) {
        console.error(err)
      });
  };

  function fetchMessages() {
    if (!studentId) return; // wait until we have studentId
    baseAPI.get(`/api/messages/student/${studentId}`)
      .then(function (res) {
        setMyMessages(res.data);
      })
      .catch(function (err) {
        console.error(err)
      });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", studentData.name);
    formData.append("email", studentData.email);
    formData.append("phone", studentData.phone);
    formData.append("city", studentData.city);
    if (studentData.profile) {
      formData.append("file", studentData.profile)
    }
    try {
      await baseAPI.put(`/api/students/${studentId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile Updated Successfully..');
      setProfileModal(false);
      fetchStudentData();
      setProfileView(null);
    }
    catch (err) {
      console.error('Error updating data:', err);
      toast.error(err.response?.data?.message);
      fetchStudentData();
    }
  };

  async function handlePasswordModelUpdate(e) {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.warn('New Passwords do not Match!');
      return;
    }
    try {
      const response = await baseAPI.post(`/api/students/account/${studentId}`, passwords);
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
    setStudentData({ ...studentData, [e.target.name]: e.target.value });
  };

  function handleFileChange(e) {
    const profileImage = e.target.files[0];
    profilePreview(profileImage);
    setStudentData({ ...studentData, profile: profileImage });
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

  return (
    <div className='dashboard-container'>
      <h3>Welcome <span className='highlight-username'>{studentData.name}</span> to the Student's Dashboard</h3>

      {studentData ? (
        <div>
          <div className='profile-container' onClick={function () { setShowSidePanel(!showSidePanel); }}>
            <img
              src={API_BASE_URL + '/' + studentData.file_path}
              className='profile-image'
            />
            {showSidePanel && (
              <ProfilePanel
                ref={panelRef}
                onViewProfile={function () { setProfileModal(true); }}
                onChangePassword={function () { setPasswordChangeModal(true); }}
                onLogout={onLogout}
              />
            )}
          </div>


          <div className='admin-dashboard-topbar'>
            <button className='topbar-button' onClick={function () { setEnrollmentModal(true) }}>Enroll in a Course</button>
            <button className='topbar-button' onClick={function () { setMessageModal(true); }}>Message Teacher</button>
            <button className='topbar-button' onClick={function () { setViewAllMessagesModal(true); setUnreadCount(0); fetchMessages(); }}>My Messages</button>
            <div className="notification-badge">
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </div>
          </div>
          < h3 > My Exams</h3>
          {!exams.length > 0 ? (<p>No Exams to Show</p>) : (
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>Exam Type</th>
                    <th>Course Name</th>
                    <th>Exam Time</th>
                    <th>Exam Date</th>

                  </tr>
                </thead>
                <tbody>
                  {
                    exams.length > 0 && exams.map(function (exam) {
                      const past = isPastExam(exam.exam_date);
                      return (
                        <tr key={exam.exam_id} className={past ? 'past-exam' : ''}>
                          <td>{exam.exam_name}</td>
                          <td>{exam.exam_type}</td>
                          <td>{exam.course_name}</td>
                          <td>{exam.exam_time}</td>
                          <td>
                            {handleDate(exam.exam_date)}
                            {!isPastExam(exam.exam_date) && (
                              <div style={{ fontSize: '12px', color: 'green' }}>
                                ({getDaysRemaining(exam.exam_date)} days left)
                              </div>
                            )}
                          </td>

                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          )}

          <br />
          <hr />

          {/* <h3>Recent Messages</h3>
          <div>
            <ul className="message-list">
              {myMessages && myMessages.length === 0 ? (
                <li>No messages yet.</li>
              ) : (
                myMessages
                  .slice(0, 2) // Show only latest 2 messages
                  .map(function (msg) {
                    return (
                      <li key={msg.id} className="message-card">
                        <div className="message-header">
                          <p><strong>To:</strong> {msg.teacher_name}</p>
                          <div className="message-body">
                            <p><strong>Message:</strong> {msg.message}</p>
                          </div>
                          <span className="message-date">
                            <p><em>Sent at:</em> {new Date(msg.created_at).toLocaleString()}</p>
                          </span>
                        </div>
                        {msg.reply ? (
                          <div className="message-reply">
                            <p><strong>Reply from {msg.teacher_name}:</strong></p>
                            <p>{msg.reply}</p>
                          </div>
                        ) : (
                          <p><em>No reply yet.</em></p>
                        )}
                      </li>
                    )
                  })
              )}
            </ul>
            {myMessages.length > 2 && (
              <div className="button-container">
                <button className="btn btn-reply" onClick={function () { setViewAllMessagesModal(true) }}>View All Messages</button>
              </div>
            )}
          </div>

          <br />
          <hr /> */}

          <div className='table-container'>
            <h3>My Exam Results</h3>
            {results.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Exam Name</th>
                    <th>course Name</th>
                    <th>Results</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(function (result, index) {
                    return (
                      <tr key={index}>
                        <td>{result.exam_name}</td>
                        <td>{result.course_name}</td>
                        <td>{result.results}</td>
                      </tr>
                    )
                  })}

                </tbody>
              </table>
            ) : (<p>No Results Available Yet...</p>)}
          </div>
          <br />


          {profileModal && (
            <ProfileModal
              studentData={studentData}
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

          {messageModal && (
            <MessageTeacherModal
              setMessageModal={setMessageModal}
              handleSendMessage={handleSendMessage}
              teacherList={teacherList}
              teacherId={teacherId}
              setTeacherId={setTeacherId}
              messageText={messageText}
              setMessageText={setMessageText}
            />
          )}

          {viewAllMessagesModal && (
            <ViewAllMessagesModal
              setViewAllMessagesModal={setViewAllMessagesModal}
              myMessages={myMessages}
            />
          )}

          {enrollmentModal && (
            <EnrollmentModal
              setEnrollmentModal={setEnrollmentModal}
              courses={courses}
              enrolledIds={enrolledIds}
              handleEnroll={handleEnroll}
              handleUnenroll={handleUnenroll}
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )
      }
    </div >
  );
};

export default StudentDashboard;