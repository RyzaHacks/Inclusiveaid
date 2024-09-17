import React from 'react';
import { FaPlus, FaFileDownload } from 'react-icons/fa';

const QuickActions = ({ setIsServiceRequestModalOpen, setIsDownloadWizardOpen }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-bold text-primary-600 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 gap-4">
      <button 
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
        onClick={() => setIsServiceRequestModalOpen(true)}
      >
        <FaPlus className="mr-2" /> New Request
      </button>
      <button
        className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200"
        onClick={() => setIsDownloadWizardOpen(true)}
      >
        <FaFileDownload className="mr-2" /> Download PDF
      </button>
    </div>
  </div>
);

export default QuickActions;
