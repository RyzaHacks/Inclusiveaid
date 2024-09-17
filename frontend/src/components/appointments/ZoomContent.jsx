import React, { useState, useEffect } from 'react';
import { FaVideo, FaCalendar, FaClock, FaUser, FaEnvelope, FaIdCard, FaPhone, FaHome, FaPlus, FaHistory } from 'react-icons/fa';
import ZoomMeetingRoom from './ZoomMeetingRoom';
import ZoomMeetingInterface from './ZoomMeetingInterface';

const ZoomContent = ({ userData }) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeMeeting, setActiveMeeting] = useState(null);
  const [inMeetingRoom, setInMeetingRoom] = useState(false);
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);
  const [pastMeetings, setPastMeetings] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    participants: '',
    message: ''
  });

  useEffect(() => {
    // TODO: Fetch upcoming and past meetings from API
    // This is a placeholder. Replace with actual API call
    setUpcomingMeetings([
      { id: 1, title: 'Team Meeting', date: '2023-07-30', time: '10:00' },
      { id: 2, title: 'Client Consultation', date: '2023-08-02', time: '14:00' },
    ]);
    setPastMeetings([
      { id: 3, title: 'Project Review', date: '2023-07-20', time: '11:00' },
      { id: 4, title: 'Training Session', date: '2023-07-15', time: '09:00' },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement Zoom API booking logic here
    console.log('Booking meeting:', meetingDetails);
    // Simulate starting a meeting
    const newMeeting = {
      ...meetingDetails,
      id: Date.now(), // Temporary ID
      startTime: `${meetingDetails.date}T${meetingDetails.time}`
    };
    setActiveMeeting(newMeeting);
    setUpcomingMeetings(prev => [...prev, newMeeting]);
    // Reset form and hide it
    setMeetingDetails({
      title: '',
      date: '',
      time: '',
      duration: 30,
      participants: '',
      message: ''
    });
    setShowBookingForm(false);
  };

  const handleJoinMeeting = () => {
    setInMeetingRoom(true);
  };

  const handleLeaveMeeting = () => {
    setInMeetingRoom(false);
    setActiveMeeting(null);
  };

  const handleCancelMeeting = (meetingId) => {
    // TODO: Implement cancellation logic with Zoom API
    setUpcomingMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
    if (activeMeeting && activeMeeting.id === meetingId) {
      setActiveMeeting(null);
    }
  };

  if (inMeetingRoom) {
    return <ZoomMeetingInterface user={userData} meeting={activeMeeting} onLeaveMeeting={handleLeaveMeeting} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-full bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-primary-600">Zoom Meetings</h2>
        {activeMeeting ? (
          <div>
            <ZoomMeetingRoom user={userData} meeting={activeMeeting} />
            <div className="mt-4 flex justify-between">
              <button 
                onClick={handleJoinMeeting} 
                className="btn btn-primary"
              >
                Join Meeting Room
              </button>
              <button 
                onClick={() => handleCancelMeeting(activeMeeting.id)} 
                className="btn btn-secondary"
              >
                Cancel Meeting
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setShowBookingForm(true)} 
            className="btn btn-primary mb-4"
          >
            <FaPlus className="mr-2" /> Book a New Meeting
          </button>
        )}
        
        {showBookingForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Meeting Title</label>
              <input
                type="text"
                name="title"
                value={meetingDetails.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="date"
                  value={meetingDetails.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Time</label>
                <input
                  type="time"
                  name="time"
                  value={meetingDetails.time}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={meetingDetails.duration}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                min="15"
                max="120"
                step="15"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Participants</label>
              <input
                type="text"
                name="participants"
                value={meetingDetails.participants}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                placeholder="Enter email addresses, separated by commas"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                name="message"
                value={meetingDetails.message}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                rows="3"
                placeholder="Optional meeting description"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-2">
              <button type="submit" className="btn btn-primary">Book Meeting</button>
              <button type="button" onClick={() => setShowBookingForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        )}
      </div>
      
      <div className="col-span-full md:col-span-1 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-600">Upcoming Meetings</h3>
        {upcomingMeetings.length > 0 ? (
          <ul className="space-y-2">
            {upcomingMeetings.map(meeting => (
              <li key={meeting.id} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{meeting.title}</p>
                  <p className="text-sm text-gray-500">{meeting.date} at {meeting.time}</p>
                </div>
                <button 
                  onClick={() => handleCancelMeeting(meeting.id)}
                  className="btn btn-sm btn-outline btn-error"
                >
                  Cancel
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No upcoming meetings scheduled.</p>
        )}
      </div>
      
      <div className="col-span-full md:col-span-1 bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-600">Meeting History</h3>
        {pastMeetings.length > 0 ? (
          <ul className="space-y-2">
            {pastMeetings.map(meeting => (
              <li key={meeting.id} className="flex items-center">
                <FaHistory className="text-primary-500 mr-2" />
                <div>
                  <p className="font-semibold">{meeting.title}</p>
                  <p className="text-sm text-gray-500">{meeting.date} at {meeting.time}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No past meetings found.</p>
        )}
      </div>

      <div className="col-span-full bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-primary-600">User Profile</h3>
        {userData ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <FaUser className="text-primary-500 mr-2" />
              <span>Name: {userData.name}</span>
            </div>
            <div className="flex items-center">
              <FaEnvelope className="text-primary-500 mr-2" />
              <span>Email: {userData.email}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="text-primary-500 mr-2" />
              <span>Phone: {userData.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="flex items-center">
              <FaIdCard className="text-primary-500 mr-2" />
              <span>NDIS Number: {userData.ndisNumber || 'Not provided'}</span>
            </div>
            <div className="flex items-center col-span-2">
              <FaHome className="text-primary-500 mr-2" />
              <span>Address: {userData.address || 'Not provided'}</span>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">User data not available.</p>
        )}
      </div>
    </div>
  );
};

export default ZoomContent;
