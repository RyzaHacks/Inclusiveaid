import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FaFile, FaPaperPlane } from 'react-icons/fa';

const MessageInput = ({ newMessage, setNewMessage, sendMessage, sendFile }) => {
  const fileInputRef = useRef(null);

  return (
    <form onSubmit={sendMessage} className="p-4 bg-gray-100 border-t">
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 input input-bordered mr-2"
          placeholder="Type your message..."
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={sendFile}
          className="hidden"
        />
        <button
          type="button"
          className="btn btn-circle btn-ghost mr-2"
          onClick={() => fileInputRef.current.click()}
        >
          <FaFile className="text-gray-500" />
        </button>
        <button type="submit" className="btn btn-primary btn-circle">
          <FaPaperPlane />
        </button>
      </div>
    </form>
  );
};

MessageInput.propTypes = {
  newMessage: PropTypes.string.isRequired,
  setNewMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  sendFile: PropTypes.func.isRequired,
};

export default MessageInput;
