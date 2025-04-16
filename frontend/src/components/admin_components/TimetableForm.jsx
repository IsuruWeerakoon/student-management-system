import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/apiConfig';

function TimetableForm({ onSubmit, editingSlot, setEditingSlot, teacherId }) {
    const baseAPI = axios.create({ baseURL: API_BASE_URL, withCredentials: true });
    const timeOptions = [
        "07:50:00", "08:30:00", "09:10:00", "09:50:00", "10:30:00", 
        "10:50:00", "11:30:00", "12:10:00", "12:50:00", "13:30:00"
    ];
    const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const [courses, setCourses] = useState([]);
    const defaultForm = { 
        day_of_week: '',
        start_time: '',
        end_time: '',
        room: '',
        course_id: '' };
    
    const [formData, setFormData] = useState(defaultForm);

    useEffect(function () {
        baseAPI.get(`/api/teacher/courses/${teacherId}`)
            .then(function (res) {
                if (res) {
                    setCourses(res.data);
                }
            });
    }, [teacherId]);

    useEffect(function () {
        if (editingSlot) {
            setFormData({ ...editingSlot });
        } else {
            setFormData(defaultForm);
        }
    }, [editingSlot?.id, teacherId]);

    function handleChange(e) {
        var name = e.target.name;
        var value = e.target.value;

        // Reset end_time if start_time is being changed
        if (name === "start_time") {
            setFormData(function (prevData) {
                return {
                    ...prevData,
                    start_time: value,
                    end_time: ""
                };
            });
        }
        else {
            setFormData(function (prevData) {
                return {
                    ...prevData,
                    [name]: value
                };
            });
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ ...formData, teacher_id: teacherId }, function () {
            setFormData(defaultForm);
        });
    }

    function getFilteredEndTimes() {
        if (!formData.start_time) {
            return [];
        }
        return timeOptions.filter(function (time) {
            return time > formData.start_time;
        });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor='course_id'>Course Name: </label>
                    <select name="course_id" value={formData.course_id} onChange={handleChange} required>
                        <option value="">--Select Course--</option>
                        {courses.map(function (course) {
                            return (
                                <option key={course.id} value={course.id}>{course.course_name}</option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor='day_of_week'>Days of Week: </label>
                    <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} required>
                        <option value="">--Select Day--</option>
                        {
                            dayOptions.map(function(day){
                                return(
                                    <option key={day} value={day}>{day}</option>
                                )
                            })
                        }
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor='start_time'>Start Time: </label>
                    <select name="start_time" value={formData.start_time} onChange={handleChange} required>
                        <option value="">--Select Start Time--</option>
                        {timeOptions.map(function (time) {
                            return (
                                <option key={time} value={time}>{time.slice(0, 5)}</option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor='end_time'>End Time: </label>
                    <select
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        disabled={!formData.start_time}
                    >
                        <option value="">--Select End Time--</option>
                        {getFilteredEndTimes().map(function (time) {
                            return (
                                <option key={time} value={time}>{time.slice(0, 5)}</option>
                            );
                        })}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor='room'>Class Room: </label>
                    <input name="room" placeholder="Class Room" value={formData.room} onChange={handleChange} required />
                </div>

                <div className='button-container'>
                    <button type="submit" className={editingSlot ? 'btn btn-update' : 'btn btn-register'}>
                        {editingSlot ? 'Update Slot' : 'Add Slot'}
                    </button>
                </div>

                {editingSlot && (
                    <div className='button-container'>
                        <button type="button" onClick={function () { setEditingSlot(null); }} className='btn btn-cancel'>
                            Cancel Edit
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}

export default TimetableForm;