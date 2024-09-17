import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar = ({ currentDate, changeMonth, renderCalendar }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-bold text-primary-600">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h3>
      <div className="flex space-x-2">
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200" onClick={() => changeMonth(-1)}>
          <FaChevronLeft />
        </button>
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200" onClick={() => changeMonth(1)}>
          <FaChevronRight />
        </button>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1 mt-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="text-center font-bold text-gray-600">{day}</div>
      ))}
      {renderCalendar()}
    </div>
  </div>
);

export default Calendar;
