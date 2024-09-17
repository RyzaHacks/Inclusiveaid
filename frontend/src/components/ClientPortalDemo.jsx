import React, { useState } from 'react';
import { FaCalendarAlt, FaChartLine, FaComments, FaFileAlt, FaBell, FaCheckCircle, FaClock, FaHome, FaCog, FaSignOutAlt, FaUser, FaWheelchair, FaTasks, FaHandsHelping } from 'react-icons/fa';

const SidebarItem = ({ icon: Icon, title, active, onClick }) => (
  <div
    className={`flex items-center p-4 cursor-pointer ${active ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-indigo-50'}`}
    onClick={onClick}
  >
    <Icon className="mr-3" />
    <span>{title}</span>
  </div>
);

const ClientPortalDemo = () => {
  const [activeSection, setActiveSection] = useState('Dashboard');

  const sidebarItems = [
    { icon: FaHome, title: 'Dashboard' },
    { icon: FaCalendarAlt, title: 'Appointments' },
    { icon: FaChartLine, title: 'NDIS Plan' },
    { icon: FaTasks, title: 'Goals' },
    { icon: FaWheelchair, title: 'Support' },
    { icon: FaHandsHelping, title: 'Resources' },
    { icon: FaCog, title: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <DashboardContent />;
      case 'Appointments':
        return <AppointmentsContent />;
      case 'NDIS Plan':
        return <NDISPlanContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-indigo-600">Client Portal</h2>
          </div>
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              {...item}
              active={activeSection === item.title}
              onClick={() => setActiveSection(item.title)}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Navbar */}
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-800">{activeSection}</h1>
            <div className="flex items-center space-x-4">
              <FaBell className="text-indigo-600 cursor-pointer" />
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                <FaUser className="text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardContent = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <FaCalendarAlt className="text-indigo-600 mr-2" />
            <span>Physiotherapy - Today, 2 PM</span>
          </li>
          <li className="flex items-center">
            <FaCalendarAlt className="text-indigo-600 mr-2" />
            <span>Support Worker - Tomorrow, 10 AM</span>
          </li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">NDIS Budget</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-indigo-600">62%</span>
          <span className="text-sm text-gray-600">Utilized</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '62%' }}></div>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
      <ul className="space-y-2">
        <li className="flex items-center">
          <FaCheckCircle className="text-green-500 mr-2" />
          <span>Goal "Independent Shopping" completed</span>
        </li>
        <li className="flex items-center">
          <FaClock className="text-yellow-500 mr-2" />
          <span>Support worker feedback pending</span>
        </li>
      </ul>
    </div>
  </div>
);

const AppointmentsContent = () => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-4">Your Appointments</h3>
    <ul className="space-y-4">
      <li className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">Physiotherapy</p>
          <p className="text-sm text-gray-600">Today, 2:00 PM</p>
        </div>
        <button className="btn btn-sm btn-outline btn-primary">Reschedule</button>
      </li>
      <li className="flex items-center justify-between border-b pb-2">
        <div>
          <p className="font-medium">Support Worker Visit</p>
          <p className="text-sm text-gray-600">Tomorrow, 10:00 AM</p>
        </div>
        <button className="btn btn-sm btn-outline btn-primary">Reschedule</button>
      </li>
      <li className="flex items-center justify-between">
        <div>
          <p className="font-medium">Occupational Therapy</p>
          <p className="text-sm text-gray-600">Next Week, Monday 3:00 PM</p>
        </div>
        <button className="btn btn-sm btn-outline btn-primary">Reschedule</button>
      </li>
    </ul>
  </div>
);

const NDISPlanContent = () => (
  <div className="space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">NDIS Plan Overview</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Plan Start Date</p>
          <p className="font-medium">1 July 2023</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Plan End Date</p>
          <p className="font-medium">30 June 2024</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Budget</p>
          <p className="font-medium">$85,000</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Remaining Budget</p>
          <p className="font-medium">$32,300</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
      <ul className="space-y-2">
        <li className="flex justify-between items-center">
          <span>Core Supports</span>
          <span className="font-medium">$45,000</span>
        </li>
        <li className="flex justify-between items-center">
          <span>Capacity Building</span>
          <span className="font-medium">$30,000</span>
        </li>
        <li className="flex justify-between items-center">
          <span>Capital Supports</span>
          <span className="font-medium">$10,000</span>
        </li>
      </ul>
    </div>
  </div>
);

export default ClientPortalDemo;