import React from 'react'

function SearchInput({value, onChange}) {
  return (
    <div className="form-group">
      <input
        type="text"
        placeholder="Search Students"
        value={value}
        onChange={onChange}
        style={{ marginBottom: '10px', padding: '5px' }} />
    </div>
  )
}

export default SearchInput