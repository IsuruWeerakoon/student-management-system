import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import Base_API_URL from '../config/apiConfig.js'
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'

const TeacherDashboard = function ({ onLogout }) {
  const baseAPI = axios.create({ baseURL: Base_API_URL, withCredentials: true });
  const [teacherID, setTeacherID] = useState(null);
  const navigate = useNavigate();

  const [teacherData, setTeacherData] = useState([]);
  const [courses, setCourses] = useState([]);

  const [students, setStudents] = useState([]);
  const [studentModal, setStudentModal] = useState(false);

  const [messages, setMessages] = useState([]);
  const [messageModal, setMessageModal] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const hours = Array.from({ length: 8 }, (_, i) => `${7 + i}:30`);
  const [timetable, setTimetable] = useState([]);

  //useEffects
  useEffect(function () {
    baseAPI.get('/api/auth/user')
      .then(function (response) {
        if (response.data.role === 'teacher') {
          setTeacherID(response.data.id);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }, []);

  useEffect(function () {
    baseAPI.get('/api/teacher/record')
      .then(function (response) {
        setTeacherData(response.data);
      })
      .catch(function (err) {
        console.log(err);
      })
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

  async function fetchEnrolledStudents(courseID) {
    try {
      const response = await baseAPI.get('/api/teacher/students/' + courseID);
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

  const timeSlots = [
    // { label: "Assembly", time: "07:30", isBreak: true },
    { label: "1st Period", start_time: "07:50", end_time: "08:30" },
    { label: "2nd Period", start_time: "08:30", end_time: "09:10" },
    { label: "3rd Period", start_time: "09:10", end_time: "09:50" },
    { label: "4th Period", start_time: "09:50", end_time: "10:30" },
    // { label: "Interval", time: "10:30", isBreak: true },
    { label: "5th Period", start_time: "10:50", end_time: "11:30" },
    { label: "6th Period", start_time: "11:30", end_time: "12:10" },
    { label: "7th Period", start_time: "12:10", end_time: "12:50" },
    { label: "8th Period", start_time: "12:50", end_time: "13:30" },
    // { label: "School closes", time: "13:30", isBreak: true },
  ];


  // const getClassAt = function (day, hour) {
  //   const slot = timetable.find(item => {
  //     const [startHour] = item.start_time.split(":");
  //     return item.day_of_week === day && parseInt(startHour) === parseInt(hour);
  //   });
  //   if (slot) {
  //     return `${slot.course_name} (${slot.room})`;
  //   }
  //   return null;
  // };

  const getClassAt = function (day, time) {
    const slot = timetable.find(function (item) {
      return item.day_of_week === day && item.start_time.startsWith(time);
    });
    if (slot) {
      return `${slot.course_name} (${slot.room})`;
    }
    return null;
  };


  return (
    <div className="container">
      <button className="logout-button" onClick={onLogout}><FiLogOut size={18} />Logout</button>
      <h2>Welcome <span className="highlight-username">{teacherData.name}</span> to the Teacher's Dashboard</h2>
      <div className="notification-badge">
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      <div className='button-container'>
        <button className='btn btn-update' onClick={function () { setMessageModal(true); fetchMessages() }}>View Messages</button>
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
<br/>
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
        <div className="modal">
          <div className="modal-content">
            <h2>Enrolled Students</h2>
            <div className="close-container">
              <button className='btn close-btn' onClick={function () { setStudentModal(false) }}>X</button>
            </div>

            {!students.length > 0 ? (<p>No Students Enrolled in this Course</p>) : (
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
                    {students.map(function (student) {
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
      )}

      {messageModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Messages from Students</h2>
            <div className="close-container">
              <button className='btn close-btn' onClick={function () { setMessageModal(false) }}>X</button>
            </div>
            {
              <ul className="message-list">
                {
                  messages.map(function (msg) {
                    return (
                      <li key={msg.id} className="message-card">
                        <div className="message-header">
                          <strong>{msg.sender_name}</strong>
                          <span className="message-date">
                            ({new Date(msg.created_at).toLocaleString()})
                          </span>
                        </div>

                        <div className="message-body">
                          <p>{msg.message}</p>

                          {msg.reply ? (
                            <p className="message-reply">
                              <strong>Replied:</strong> {msg.reply}
                            </p>
                          ) : (
                            <form
                              onSubmit={function (e) {
                                e.preventDefault();
                                const replyText = e.target.reply.value;
                                baseAPI
                                  .post(`/api/messages/reply/${msg.id}`, {
                                    reply: replyText,
                                  })
                                  .then(function () {
                                    toast.success("Reply message sent!");
                                    return fetchMessages();
                                  })
                                  .then(function (res) {
                                    setMessages(res.data);
                                  })
                                  .catch(function (err) {
                                    console.error(err);
                                  });
                              }}
                              className="reply-form"
                            >
                              <textarea
                                name="reply"
                                placeholder="Write a reply..."
                                required
                                className="reply-textarea"
                              />
                              <div className='button-container'>
                                <button type="submit" className="btn btn-reply">
                                  Send Reply
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      </li>
                    );
                  })}
              </ul>
            }
          </div>
        </div>
      )}
    </div >
  )
}

export default TeacherDashboard;