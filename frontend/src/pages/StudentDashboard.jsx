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
  
  return (
    <div className='container'>
      <button className="logout-button" onClick={onLogout}><FiLogOut size={18} />Logout</button>
      <h1>Students Dashboard</h1>
      <h3>Welcome {studentData.name}</h3>

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
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <h3>My Exams</h3>
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