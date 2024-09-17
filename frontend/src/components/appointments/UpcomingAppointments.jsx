import React from 'react';
import { FaCalendar, FaClock } from 'react-icons/fa';

const UpcomingAppointments = ({ appointments }) => {
  return (
    <div className="space-y-4">
      {appointments.map((appointment, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <h4 className="font-semibold">{appointment.type}</h4>
            <p className="text-sm text-gray-600">{appointment.provider}</p>
          </div>
          <div>
            <p className="flex items-center text-sm text-gray-600">
              <FaCalendar className="mr-1" /> {appointment.date}
            </p>
            <p className="flex items-center text-sm text-gray-600">
              <FaClock className="mr-1" /> {appointment.time}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAppointments;