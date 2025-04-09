import React from 'react'

function SearchCourse({value, handleChange}) {
    return (
        <div className="form-group">
            <input
                type="text"
                placeholder="Search Courses"
                value={value}
                onChange={handleChange}
            />
        </div>
    )
}

export default SearchCourse