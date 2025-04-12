import React from 'react';

function TeacherExamModal(props) {

    return (
        <div className='modal'>
            <div className='modal-content'>
                <div className="close-container">
                    <button className='btn close-btn' onClick={function () {
                        props.onClose();
                        props.onReset();
                    }}>X</button>
                </div>
                {props.editingExamId ?
                    <h2>{props.courseName} Exams Update Form</h2> :
                    <h2>{props.courseName} Exams Registration Form</h2>
                }
                <form onSubmit={props.onSubmit}>
                    <div className="form-group">
                        <label htmlFor='course_id'>Course Name: </label>
                        <select name="course_id" value={props.form.course_id} onChange={props.onChange} required>
                            <option value="">Select Course</option>
                            <option value={props.courseId}>{props.courseName}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor='exam_name'>Exam Name: </label>
                        <input name="exam_name" placeholder="Exam Name" value={props.form.exam_name} onChange={props.onChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor='exam_date'>Exam Date: </label>
                        <input name="exam_date" type="date" value={props.form.exam_date} min={new Date().toISOString().split('T')[0]} onChange={props.onChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor='exam_time'>Exam Time: </label>
                        <input name="exam_time" type="time" value={props.form.exam_time} onChange={props.onChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor='exam_type'>Exam Type: </label>
                        <select name="exam_type" value={props.form.exam_type} onChange={props.onChange} required>
                            <option value="Midterm">Midterm</option>
                            <option value="Final">Final</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Project">Project</option>
                        </select>
                    </div>
                    <div className='button-container'>
                        {props.editingExamId ?
                            <button type="submit" className='btn btn-update'>Update Exam</button> :
                            <button type="submit" className='btn btn-success'>Create Exam</button>
                        }
                    </div>
                </form>
            </div>
        </div>
    );
}

export default TeacherExamModal;