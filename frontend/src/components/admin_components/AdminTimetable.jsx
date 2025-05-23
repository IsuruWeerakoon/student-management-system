import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TimetableTable from './TimetableTable';
import TimetableForm from './TimetableForm';
import API_BASE_URL from '../../config/apiConfig';
import { toast } from 'react-toastify';

function AdminTimetable() {
    const baseAPI = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true
    });
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [timetable, setTimetable] = useState([]);
    const [editingSlot, setEditingSlot] = useState(null);

    useEffect(function () {
        baseAPI.get(`/api/teachers`)
            .then(function (response) {
                setTeachers(response.data);
            })
            .catch(function (err) {
                console.log(err);
            })
    }, []);

    useEffect(function () {
        if (selectedTeacher) {
            baseAPI.get(`/api/timetable/teacher/${selectedTeacher}`)
                .then(function (res) {
                    setTimetable(res.data)
                })
                .catch(function (err) {
                    console.error(err)
                });
        }
    }, [selectedTeacher]);

    function handleAddOrUpdate(slotData, resetFormCallback) {
        if (editingSlot) {
            baseAPI.put(`/api/timetable/${editingSlot.id}`, slotData)
                .then(function (res) {
                    toast.success(res.data.message);
                    setEditingSlot(null);
                    reloadTimetable();
                    setShowForm(false);

                    if (resetFormCallback) resetFormCallback();
                })
                .catch(function (err) {
                    toast.error(err.response?.data?.message);
                });
        } else {
            baseAPI.post(`/api/timetable`, { ...slotData, teacher_id: selectedTeacher })
                .then(function (response) {
                    toast.success(response.data.message);
                    reloadTimetable();
                    setShowForm(false);

                    if (resetFormCallback) resetFormCallback();
                })
                .catch(function (err) {
                    toast.error(err.response?.data?.message);
                });
        }
    }

    function handleDelete(id) {
        var result = confirm("Are you sure about Deleting this Time Slot..?");
        if (result) {
            baseAPI.delete(`/api/timetable/${id}`)
                .then(function () {
                    reloadTimetable()
                    toast.info(`Time Slot Freed Successfully..`);
                })
                .catch(function (err) {
                    console.log(err);
                })
        }
    };

    const reloadTimetable = function () {
        baseAPI.get(`/api/timetable/teacher/${selectedTeacher}`)
            .then(function (res) {
                setTimetable(res.data)
            });
    };

    const [showForm, setShowForm] = useState(false);
    function handleFormView() {
        setShowForm(true);
        setEditingSlot(null);
    }
    return (
        <div className="container">
            <h2>Teacher Timetable Management</h2>

            <div className='button-container'>
                <select
                    value={selectedTeacher}
                    onChange={function (e) { setSelectedTeacher(e.target.value); setEditingSlot(null); }}
                >
                    <option value="">Select a teacher</option>
                    {teachers.map(function (teacher) {
                        return (
                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        )
                    })}
                </select>
            </div>

            {selectedTeacher && (
                <>
                    <div className='button-container'>
                        <button className='btn btn-reply' onClick={handleFormView}>Add Time Slot</button>
                    </div>

                    {showForm && (
                        <TimetableForm
                            onSubmit={handleAddOrUpdate}
                            editingSlot={editingSlot}
                            setEditingSlot={setEditingSlot}
                            teacherId={selectedTeacher}
                            onClose={function () { setShowForm(false); setEditingSlot(null) }}
                        />
                    )
                    }
                    {
                        timetable.length > 0 ? (
                            <TimetableTable
                                data={timetable}
                                onEdit={function (slot) {
                                    setEditingSlot(slot);
                                    setShowForm(true);
                                }}
                                onDelete={handleDelete}
                            />
                        ) : (<p>No Records Yet to Show</p>)
                    }
                </>
            )}
        </div>
    );
}

export default AdminTimetable;