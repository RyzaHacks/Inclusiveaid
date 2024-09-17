import React from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';

const ServiceControls = ({ activeTab, setActiveTab, searchTerm, setSearchTerm, setIsServiceRequestModalOpen, setIsDownloadWizardOpen }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'approved', 'pending', 'rejected'].map((tab) => (
          <button 
            key={tab}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
              activeTab === tab 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search services..."
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <button 
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-200"
          onClick={() => setIsServiceRequestModalOpen(true)}
        >
          <FaPlus className="mr-2" /> Request Service
        </button>
      </div>
    </div>
  </div>
);

export default ServiceControls;
