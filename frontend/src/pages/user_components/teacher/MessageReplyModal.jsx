import React from "react";

function MessageReplyModal(props) {
  return (
    <div className="modal">
      <div className="modal-content-message">
        <h2>Messages from Students</h2>
        <div className="close-container">
          <button
            className="btn close-btn"
            onClick={function () {
              props.setMessageModal(false);
            }}
          >
            X
          </button>
        </div>

        <ul className="message-list">
          {props.messages.map(function (msg) {
            return (
              <li key={msg.id} className="message-card">
                <div className="message-header">
                  <strong>{msg.sender_name}</strong>
                  <span className="message-date">
                    ({new Date(msg.created_at).toLocaleString()})
                  </span>
                </div>

                <div className="message-body">
                  <p>{msg.message}</p>
                  {msg.reply ? (
                    <p className="message-reply">
                      <strong>Replied:</strong> {msg.reply}
                    </p>
                  ) : (
                    <form
                      onSubmit={function (e) {
                        e.preventDefault();
                        props.onReplySubmit(e, msg.id);
                      }}
                      className="reply-form"
                    >
                      <textarea
                        name="reply"
                        placeholder="Write a reply..."
                        required
                        className="reply-textarea"
                      />
                      <div className="button-container">
                        <button type="submit" className="btn btn-reply">
                          Send Reply
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MessageReplyModal;