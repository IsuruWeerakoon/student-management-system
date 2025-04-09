import React from 'react'
import StudentRow from './StudentRow.jsx';

function StudentTable({studentData, handleDelete}) {
    if (studentData.length === 0) {
        return (
            <tr>
                <td colSpan='7'>No Results Found</td>
            </tr>
        );
    }
    else {
        return (
            <>
                {studentData.map(function (student) {
                    return <StudentRow key={student.id} student={student} handleDelete={handleDelete} />
                })}
            </>
        );
    }
};
export default StudentTable