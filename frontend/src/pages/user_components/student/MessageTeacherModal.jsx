import React from 'react';

function MessageTeacherModal(props) {
  return (
    <div className='modal'>
      <div className='modal-content-message'>
        <h3>Message to Teacher</h3>
        <div className="close-container">
          <button className='btn close-btn' onClick={function () { props.setMessageModal(false) }}>X</button>
        </div>
        <form onSubmit={props.handleSendMessage}>
          <div className="form-group">
            <select value={props.teacherId} onChange={function (e) { props.setTeacherId(e.target.value) }} required>
              <option value="">Select Teacher</option>
              {props.teacherList.map(function (teacher) {
                return <option key={teacher.id} value={teacher.id}>{teacher.name}</option>;
              })}
            </select>
          </div>
          <div className="form-group">
            <textarea
              placeholder="Type your message..."
              value={props.messageText}
              onChange={function (e) { props.setMessageText(e.target.value) }}
              required
              className="reply-textarea"
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn btn-reply">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageTeacherModal;