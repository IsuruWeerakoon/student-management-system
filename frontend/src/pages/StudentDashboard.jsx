import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/apiConfig';
import { toast } from 'react-toastify';
import '../App.css';

// StudentDashboard Component for Viewing Courses, Exams, and Results
const StudentDashboard = function ({ onLogout }) {
  const [studentData, setStudentData] = useState({ name: '', email: '', phone: '', dob: '', gender: '', city: '' });
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
  const navigate = useNavigate();
  const [studentId, setStudentId] = useState(null);



  useEffect(function () {
    baseAPI.get('/api/auth/user')
      .then(function (res) {
        if (res.data.role === 'student') {
          setStudentId(res.data.id);
        }
      })
      .catch(function (err) {
        console.error('Error fetching user info', err);
      });
  }, []);

  useEffect(function () {
    fetchStudentData();
  }, []);

  useEffect(function () {
    baseAPI.get('/api/exams/studentdata')
      .then(function (res) {
        const sortedExams = res.data.sort(function (a, b) {
          return new Date(b.exam_date) - new Date(a.exam_date);
        });
        setExams(sortedExams);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);


  useEffect(function () {
    baseAPI.get('/api/results/student')
      .then(function (res) {
        setResults(res.data)
      });
  }, []);

  async function fetchStudentData() {
    try {
      const response = await baseAPI.get('/api/students/record');
      setStudentData(response.data);
    }
    catch (err) {
      console.error('Error fetching data:', err);
      toast.error(err.response?.data?.message);
    }
  };

  function handleDate(DATE) { return DATE.split('T')[0]; };


  function isPastExam(dateStr) {
    const today = new Date();
    const examDate = new Date(dateStr);
    return examDate < today.setHours(0, 0, 0, 0);
  }

  function getDaysRemaining(dateStr) {
    const today = new Date();
    const examDate = new Date(dateStr);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }


  const [messageText, setMessageText] = useState('');
  const [teacherId, setTeacherId] = useState(''); // Optional: dropdown for teachers
  const [teacherList, setTeacherList] = useState([]);

  useEffect(function () {
    baseAPI.get('/api/teachers')
      .then(function (res) {
        setTeacherList(res.data)
      })
      .catch(function (err) {
        console.error('Failed to load teacher list:', err)
      });
  }, []);



  function handleSendMessage(e) {
    e.preventDefault();
    baseAPI.post('/api/messages/send', {
      sender_id: studentId, // from login session
      receiver_id: teacherId,
      sender_role: 'student',
      message: messageText
    })
      .then(function () {
        toast.success('Message sent');
        setMessageText('');
      })
      .catch(function (err) { console.error(err) });
  };


  const [myMessages, setMyMessages] = useState([]);

  useEffect(function () {
    if (!studentId) return; // wait until we have studentId
    baseAPI.get(`/api/messages/student/${studentId}`)
      .then(function (res) {
        setMyMessages(res.data);
      })
      .catch(function (err) {
        console.error(err)
      });
  }, [studentId]);

  const [messageModal, setMessageModal] = useState(false);

  return (
    <div className='container'>
      <button className="logout-button" onClick={onLogout}><FiLogOut size={18} />Logout</button>
      <h3>Welcome <span className='highlight-username'>{studentData.name}</span> to the Student's Dashboard</h3>

      {studentData ? (
        <div className='model'>
          <div className='profileUpdate'>
            <img
              src={API_BASE_URL + '/' + studentData.file_path}
              style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
          <br />
          <table>
            <tbody>
              <tr>
                <td>
                  <p><strong>Full Name: </strong> {studentData.name}</p>
                  <p><strong>Email Address: </strong> {studentData.email}</p>
                  <p><strong>Phone Number: </strong> {studentData.phone}</p>
                </td>
                <td>
                  <p><strong>Date of Birth: </strong>{handleDate(studentData.dob)}</p>
                  <p><strong>Gender: </strong>{studentData.gender}</p>
                  <p><strong>City: </strong>{studentData.city}</p>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="button-container">
            <button className='btn btn-update' onClick={function () { navigate(`/student_update/${studentData.id}`) }}>Edit Account Details</button>
          </div>
          <div className="button-container">
            <button className='btn btn-register' onClick={function () { navigate('/manage_enrollments') }}>Manage Enrollments</button>
          </div>
          <div className="button-container">
            <div className='btn btn-reply' onClick={function () { setMessageModal(true); }}>Message Teacher</div>
          </div>


          {messageModal &&
            <div className='modal'>
              <div className='modal-content'>
                <h3>Message to Teacher</h3>
                <div className="close-container">
                  <button className='btn close-btn' onClick={function () { setMessageModal(false) }}>X</button>
                </div>
                <form onSubmit={handleSendMessage} className="reply-form">
                  <div className="form-group">
                    <select value={teacherId} onChange={e => setTeacherId(e.target.value)} required>
                      <option value="">Select Teacher</option>
                      {teacherList.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={function (e) { setMessageText(e.target.value) }}
                      required
                      className="reply-textarea"
                    />
                  </div>
                  <div className="button-container">
                    <button type="submit" className="btn btn-reply">Send</button>
                  </div>
                </form>
              </div>
            </div>
          }

          <h3>Your Messages</h3>
          <div>
            <ul className="message-list">
              {myMessages && myMessages.length === 0 ? (
                <li>No messages yet.</li>
              ) : (
                myMessages.map(msg => (
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
                ))
              )}
              <hr />
            </ul>
          </div>







        </div>
      ) : (
        <p>Loading...</p>
      )
      }

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
                        {exam.exam_date.split('T')[0]}
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

      <div className='table-container'>
        <h2>My Exam Results</h2>
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
    </div >
  );
};

export default StudentDashboard;