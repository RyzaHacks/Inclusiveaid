import React, { useState } from 'react';
import { FaVideo, FaCalendar, FaClock, FaUser, FaEnvelope } from 'react-icons/fa';

const ZoomBooking = () => {
  const [showForm, setShowForm] = useState(false);
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    participants: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMeetingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement Zoom API booking logic here
    console.log('Booking meeting:', meetingDetails);
    // Reset form and hide it
    setMeetingDetails({
      title: '',
      date: '',
      time: '',
      duration: 30,
      participants: '',
      message: ''
    });
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600 flex items-center">
        <FaVideo className="mr-2" /> Zoom Meetings
      </h3>
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary btn-sm w-full"
        >
          Book a Meeting
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label className="text-sm text-gray-600">Meeting Title</label>
            <input
              type="text"
              name="title"
              value={meetingDetails.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              required
            />
          </div>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Date</label>
              <div className="relative">
                <FaCalendar className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="date"
                  name="date"
                  value={meetingDetails.date}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                  required
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">Time</label>
              <div className="relative">
                <FaClock className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="time"
                  name="time"
                  value={meetingDetails.time}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={meetingDetails.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md text-sm"
              min="15"
              max="120"
              step="15"
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Participants</label>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                name="participants"
                value={meetingDetails.participants}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                placeholder="Enter email addresses"
                required
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Message</label>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
              <textarea
                name="message"
                value={meetingDetails.message}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                rows="3"
                placeholder="Optional meeting description"
              ></textarea>
            </div>
          </div>
          <div className="flex space-x-2">
            <button type="submit" className="btn btn-primary btn-sm flex-1">Book</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn btn-outline btn-sm flex-1">Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ZoomBooking;