// components/CourseForm.jsx
import React from 'react';

function CourseForm({ courseData, handleChange, handleSubmit, isEditMode, onClose }) {
    return (
        <div className="modal">
            <div className="modal-content-courses">
                <div className="close-container">
                    <button className='btn close-btn' onClick={onClose}>X</button>
                </div>
                <h2>{isEditMode ? 'Course Update Form' : 'Course Registration Form'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor='course_name'>Course Name: </label>
                        <input
                            type='text'
                            name='course_name'
                            placeholder='Course Name'
                            value={courseData.course_name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor='course_description'>Course Description: </label>
                        <input
                            type='text'
                            name='course_description'
                            placeholder='Course Description'
                            value={courseData.course_description || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor='course_period'>Course Period: </label>
                        <input
                            type='text'
                            name='course_period'
                            placeholder='Course Period'
                            value={courseData.course_period || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="button-container">
                        <button className={isEditMode ? 'btn btn-update' : 'btn btn-success'} type='submit'>
                            {isEditMode ? 'Update' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CourseForm;