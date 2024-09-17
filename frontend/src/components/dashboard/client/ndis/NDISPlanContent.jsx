import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaChartPie, FaFileDownload, FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaExclamationCircle, FaUser, FaArrowRight } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import api from '../../../../utils/api';
import DownloadPlanWizard from './DownloadPlanWizard';

const NDISPlanContent = ({ userData }) => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloadWizardOpen, setIsDownloadWizardOpen] = useState(false);

  useEffect(() => {
    const fetchNDISPlan = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/v1/ndis-plans/ndis-plan');
        setPlanData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching NDIS plan:', err);
        setError('Failed to load NDIS plan data. Please try again later.');
        setLoading(false);
      }
    };

    fetchNDISPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!planData) {
    return <div className="text-center text-gray-600">No NDIS plan data available.</div>;
  }

  const getBudgetStatus = (used, total) => {
    const percentageUsed = (used / total) * 100;
    if (percentageUsed >= 90) {
      return { icon: FaExclamationCircle, color: 'text-red-500', bgColor: 'bg-red-100', message: 'Critical: Budget nearly exhausted' };
    } else if (percentageUsed >= 75) {
      return { icon: FaExclamationTriangle, color: 'text-yellow-500', bgColor: 'bg-yellow-100', message: 'Warning: Budget usage high' };
    } else {
      return { icon: FaCheckCircle, color: 'text-green-500', bgColor: 'bg-green-100', message: 'On track' };
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-white to-blue-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-2xl font-bold mb-6 text-primary-600">Plan Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { icon: FaCalendarAlt, label: "Start Date", value: new Date(planData.startDate).toLocaleDateString() },
              { icon: FaCalendarAlt, label: "End Date", value: new Date(planData.endDate).toLocaleDateString() },
              { icon: FaInfoCircle, label: "Status", value: planData.status }
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-md">
                <item.icon className="text-primary-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[
              { icon: FaChartPie, label: "Total Budget", value: `$${planData.totalBudget.toLocaleString()}` },
              { icon: FaChartPie, label: "Used Budget", value: `$${planData.usedBudget.toLocaleString()}` },
              { icon: FaChartPie, label: "Remaining Budget", value: `$${(planData.totalBudget - planData.usedBudget).toLocaleString()}` }
            ].map((item, index) => (
              <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-md">
                <item.icon className="text-primary-500 text-2xl mr-3" />
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-purple-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-2xl font-bold mb-6 text-primary-600">Funding Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(planData.fundingCategories).map(([category, budget]) => {
            const used = budget.used || 0;
            const total = budget.total || budget;
            const { icon: StatusIcon, color, bgColor, message } = getBudgetStatus(used, total);
            return (
              <motion.div 
                key={category}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h4 className="font-semibold text-lg mb-2">{category}</h4>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total: ${total.toLocaleString()}</span>
                  <span className="text-gray-600">Used: ${used.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                  <div 
                    className="bg-primary-600 h-4 rounded-full transition-all duration-500 ease-in-out"
                    style={{ width: `${(used / total) * 100}%` }}
                  ></div>
                </div>
                <div className={`flex items-center ${bgColor} p-2 rounded-md`}>
                  <StatusIcon className={`mr-2 ${color}`} />
                  <span className={`${color} font-medium`}>{message}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGoalsTab = () => (
    <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-6 text-primary-600">Plan Goals</h3>
      {planData.goals && planData.goals.length > 0 ? (
        <div className="space-y-4">
          {planData.goals.map((goal, index) => (
            <motion.div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <h4 className="font-semibold text-primary-600 mb-2">{goal.category}</h4>
              <p className="text-gray-700">{goal.description}</p>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 italic">No goals have been set for this plan.</p>
      )}
    </div>
  );

  const renderServiceWorkerTab = () => (
    <div className="bg-gradient-to-br from-white to-yellow-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold mb-6 text-primary-600">Assigned Service Worker</h3>
      {planData.assignedServiceWorker ? (
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-4xl shadow-lg">
            <FaUser />
          </div>
          <div>
            <p className="font-semibold text-2xl mb-1">{planData.assignedServiceWorker.name}</p>
            <p className="text-gray-600">{planData.assignedServiceWorker.email}</p>
            <button className="mt-4 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors duration-300 flex items-center">
              Contact <FaArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 italic">No service worker assigned.</p>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div
        className="bg-gradient-to-br from-primary-100 to-primary-200 p-8 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold mb-6 text-primary-800">Your NDIS Plan</h2>
        <div className="flex space-x-4 mb-8">
          {['overview', 'goals', 'serviceWorker'].map((tab) => (
            <button 
              key={tab}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-primary-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-primary-600 hover:bg-primary-50'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'goals' && renderGoalsTab()}
        {activeTab === 'serviceWorker' && renderServiceWorkerTab()}
      </motion.div>

      <motion.div
        className="bg-gradient-to-br from-secondary-100 to-secondary-200 p-8 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-3xl font-bold mb-6 text-secondary-800">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: FaCalendarAlt, text: "Request Review", primary: true },
            { icon: FaChartPie, text: "Detailed Reports" },
            { icon: FaFileDownload, text: "Download Plan", onClick: () => setIsDownloadWizardOpen(true) },
            { icon: FaInfoCircle, text: "Support Contacts" }
          ].map((action, index) => (
            <button 
              key={index}
              onClick={action.onClick}
              className={`p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center space-y-2 ${
                action.primary 
                  ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                  : 'bg-white text-secondary-600'
              }`}
            >
              <action.icon className="text-3xl" />
              <span className="font-medium">{action.text}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {planData.reviewDate && (
        <motion.div
          className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mr-3" />
            <p className="font-bold text-2xl text-yellow-700">Upcoming Review</p>
          </div>
          <p className="mt-2 text-yellow-800">
            Your plan review is scheduled for <span className="font-semibold">{new Date(planData.reviewDate).toLocaleDateString()}</span>. 
            Please ensure all necessary documentation is prepared.
          </p>
        </motion.div>
      )}

      <DownloadPlanWizard 
        isOpen={isDownloadWizardOpen}
        onClose={() => setIsDownloadWizardOpen(false)}
        planData={planData}
      />
    </div>
  );
};

export default NDISPlanContent;
