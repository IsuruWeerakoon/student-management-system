import React from 'react';

function ViewAllMessagesModal(props) {
  return (
    <div className="modal">
      <div className='modal-content-message'>
        <h3>All Messages</h3>
        <div className="close-container">
          <button className="btn close-btn" onClick={function () { props.setViewAllMessagesModal(false) }}>X</button>
        </div>
        <ul className="message-list">
          {props.myMessages.map(function (msg) {
            return (
              <li key={msg.id} className="message-card">
                <div className="message-header">
                  <p><strong>To:</strong> {msg.teacher_name}</p>
                  <div className="message-body">
                    <p><strong>Message:</strong> {msg.message}</p>
                  </div>
                  <span className="message-date">
                    <p><em>Sent at:</em> {new Date(msg.created_at).toLocaleString()}</p>
                  </span>
                </div>
                {msg.reply ? (
                  <div className="message-reply">
                    <p><strong>Reply from {msg.teacher_name}:</strong></p>
                    <p>{msg.reply}</p>
                  </div>
                ) : (
                  <p><em>No reply yet.</em></p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ViewAllMessagesModal;