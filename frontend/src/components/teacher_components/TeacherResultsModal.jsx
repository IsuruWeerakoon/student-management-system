import React from 'react';

function TeacherResultsModal(props) {
    function handleInputChange(studentId, value) {
        props.onResultChange(studentId, value);
    }

    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className="close-container">
                    <button className='btn close-btn' onClick={props.onClose}>X</button>
                </div>
                <h3>Submit Results</h3>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Marks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.students.map(function (s) {
                                return (
                                    <tr key={s.id}>
                                        <td>{s.name}</td>
                                        <td>
                                            <input
                                                type="number"
                                                placeholder="Marks"
                                                value={props.results[s.id] || ''}
                                                onChange={function (e) {
                                                    handleInputChange(s.id, e.target.value);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className='button-container'>
                        <button className={props.hasExisting ? 'btn btn-update' : 'btn btn-success'} onClick={props.onSubmit}>
                            {props.hasExisting ? 'Update Results' : 'Submit Results'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TeacherResultsModal;