import React from 'react';

function TimetableTable({ data, onEdit, onDelete }) {
    return (
        <div className='table-container'>
                <table>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Course</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map(function (slot) {
                            return (
                                <tr key={slot.id}>
                                    <td>{slot.day_of_week}</td>
                                    <td>{slot.start_time}</td>
                                    <td>{slot.end_time}</td>
                                    <td>{slot.course_name}</td>
                                    <td>{slot.room}</td>
                                    <td>
                                        <button onClick={function () { onEdit(slot) }} className="btn btn-update">Edit</button>
                                        <button onClick={function () { onDelete(slot.id) }} className="btn btn-delete">Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
        </div>
    );
}

export default TimetableTable;