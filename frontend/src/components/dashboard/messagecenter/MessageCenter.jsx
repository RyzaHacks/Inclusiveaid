import React, { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaSearch, FaCog, FaBell, FaChevronDown, FaChevronUp, FaTimes } from 'react-icons/fa';
import api from '../../../utils/api';
import ContactItem from './ContactItem';
import MessageItem from './MessageItem';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import { getBgColorByRole } from './utils';
import useFetchData from '../../../hooks/useFetchData';

const MessageCenter = ({ userRole, userData }) => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMoreUsers, setShowMoreUsers] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [selectedNavItem, setSelectedNavItem] = useState('inbox');

  const { data: conversations, isLoading: isLoadingConversations, error: errorConversations } = useFetchData('/api/users/conversations');
  const { data: contacts, isLoading: isLoadingContacts, error: errorContacts } = useFetchData(userRole === 'admin' ? '/api/users/admin/users' : '/api/users/contacts');
  const { data: unreadCount, isLoading: isLoadingUnreadCount, error: errorUnreadCount } = useFetchData('/api/users/messages/unread-count');

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.partnerId);
    }
  }, [selectedUser, selectedNavItem]);

  const fetchMessages = async (partnerId) => {
    try {
      let response;
      if (selectedNavItem === 'inbox') {
        response = await api.get(`/api/users/messages/${partnerId}`);
        setMessages(response.data);
      } else if (selectedNavItem === 'sent') {
        response = await api.get('/api/users/messages/sent');
        setSentMessages(response.data);
      } else if (selectedNavItem === 'drafts') {
        response = await api.get('/api/users/messages/drafts');
        setDrafts(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const response = await api.post('/api/users/messages', {
        receiverId: selectedUser.partnerId,
        content: newMessage,
      });
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendFile = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUser) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('receiverId', selectedUser.partnerId);

    try {
      const response = await api.post('/api/users/messages/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessages([...messages, response.data]);
    } catch (error) {
      console.error('Error sending file:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      await api.delete(`/api/users/messages/${messageId}`);
      setMessages(messages.filter((message) => message.id !== messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const searchMessages = async () => {
    try {
      const response = await api.get(`/api/users/messages/search?query=${searchTerm}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error searching messages:', error);
    }
  };

  const filteredConversations = conversations?.filter((conversation) =>
    conversation.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const displayedConversations = showMoreUsers ? filteredConversations : filteredConversations.slice(0, 4);

  return (
    <div className="flex h-full bg-gray-100">
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <button className="btn btn-primary btn-block" onClick={() => setShowContacts(true)}>Compose</button>
        </div>
        <nav className="mt-4">
          <button
            className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 ${
              selectedNavItem === 'inbox' ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedNavItem('inbox')}
          >
            Inbox
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 ${
              selectedNavItem === 'sent' ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedNavItem('sent')}
          >
            Sent
          </button>
          <button
            className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 ${
              selectedNavItem === 'drafts' ? 'bg-gray-200' : ''
            }`}
            onClick={() => setSelectedNavItem('drafts')}
          >
            Drafts
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <input 
              type="text" 
              placeholder="Search messages" 
              className="input input-bordered w-64 mr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-ghost btn-circle" onClick={searchMessages}>
              <FaSearch />
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <FaCog className="text-gray-500 cursor-pointer" />
            <div className="relative">
              <FaBell className="text-gray-500 cursor-pointer" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 bg-white border-r overflow-y-auto">
            {displayedConversations.map((conversation) => (
              <div
                key={conversation.partnerId}
                className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                  selectedUser?.partnerId === conversation.partnerId ? 'bg-gray-200' : ''
                }`}
                onClick={() => setSelectedUser(conversation)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    {conversation.partnerName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{conversation.partnerName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(conversation.lastMessageAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {filteredConversations.length > 4 && (
              <button
                className="btn btn-outline btn-block mt-4"
                onClick={() => setShowMoreUsers(!showMoreUsers)}
              >
                {showMoreUsers ? <FaChevronUp /> : <FaChevronDown />}
                {showMoreUsers ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col bg-white">
            {selectedUser ? (
              <>
                <ChatHeader selectedUser={selectedUser} />
                <div className="flex-1 p-6 overflow-y-auto">
                  {selectedNavItem === 'inbox' && messages.map((message, index) => (
                    <MessageItem
                      key={index}
                      message={message}
                      onDelete={deleteMessage}
                      userData={userData}
                    />
                  ))}
                  {selectedNavItem === 'sent' && sentMessages.map((message, index) => (
                    <MessageItem
                      key={index}
                      message={message}
                      onDelete={deleteMessage}
                      userData={userData}
                    />
                  ))}
                  {selectedNavItem === 'drafts' && drafts.map((message, index) => (
                    <MessageItem
                      key={index}
                      message={message}
                      onDelete={deleteMessage}
                      userData={userData}
                    />
                  ))}
                </div>
                <MessageInput
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  sendMessage={sendMessage}
                  sendFile={sendFile}
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <FaEnvelope className="text-6xl text-gray-300" />
                <p className="text-lg text-gray-500">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>

        {showContacts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Contacts</h3>
                <button onClick={() => setShowContacts(false)} className="btn btn-ghost btn-circle">
                  <FaTimes />
                </button>
              </div>
              
              {userRole === 'admin' ? (
                <div>
                  <h4 className="text-lg font-semibold mb-2">All Users</h4>
                  {contacts?.map((contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      onClick={() => {
                        setSelectedUser({ partnerId: contact.id, partnerName: contact.name });
                        setShowContacts(false);
                      }}
                      bgColor={getBgColorByRole(contact.role)}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {/* Additional role-specific contact handling can go here */}
                  {contacts?.map((contact) => (
                    <ContactItem
                      key={contact.id}
                      contact={contact}
                      onClick={() => {
                        setSelectedUser({ partnerId: contact.id, partnerName: contact.name });
                        setShowContacts(false);
                      }}
                      bgColor="bg-gray-300"
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;
