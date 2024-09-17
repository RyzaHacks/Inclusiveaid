import React, { useState } from 'react'; // Make sure to import useState
import { motion } from 'framer-motion';
import { Doughnut, Line } from 'react-chartjs-2';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaCalendarAlt, FaChartLine } from 'react-icons/fa';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';

// Register the chart elements
Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const NDISPlanModal = ({ isOpen, onClose, ndisPlan, assignedServiceWorkers, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('overview'); // State for active tab

    if (!isOpen || !ndisPlan) return null;

    const totalBudget = ndisPlan.totalBudget;
    const usedBudget = ndisPlan.usedBudget;

    const getBudgetStatus = (used, total) => {
        const percentage = (used / total) * 100;
        if (percentage < 50) return { icon: FaCheckCircle, color: 'text-green-500', message: 'On track' };
        if (percentage < 80) return { icon: FaInfoCircle, color: 'text-yellow-500', message: 'Monitor closely' };
        return { icon: FaExclamationTriangle, color: 'text-red-500', message: 'Nearing limit' };
    };

    const renderOverview = () => {
        const doughnutData = {
            labels: Object.keys(ndisPlan.fundingCategories),
            datasets: [
                {
                    data: Object.values(ndisPlan.fundingCategories).map(category => category.total),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                },
            ],
        };

        const lineData = {
            labels: Object.keys(ndisPlan.fundingCategories),
            datasets: [
                {
                    label: 'Used Budget',
                    data: Object.values(ndisPlan.fundingCategories).map(category => category.used || 0),
                    fill: false,
                    borderColor: '#36A2EB',
                },
                {
                    label: 'Total Budget',
                    data: Object.values(ndisPlan.fundingCategories).map(category => category.total),
                    fill: false,
                    borderColor: '#FF6384',
                },
            ],
        };

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Plan Summary</h3>
                        <p className="text-gray-600">Plan Start: <span className="font-semibold">{new Date(ndisPlan.startDate).toLocaleDateString()}</span></p>
                        <p className="text-gray-600">Plan End: <span className="font-semibold">{new Date(ndisPlan.endDate).toLocaleDateString()}</span></p>
                        <p className="text-gray-600">Status: <span className="font-semibold">{ndisPlan.planStatus || 'Active'}</span></p>
                        <p className="text-gray-600">Review Date: <span className="font-semibold">{ndisPlan.reviewDate ? new Date(ndisPlan.reviewDate).toLocaleDateString() : 'Not scheduled'}</span></p>
                        <p className="text-gray-600">Assigned Service Workers:</p>
                        <ul>
                            {assignedServiceWorkers.map((worker, index) => (
                                <li key={index} className="text-gray-600">
                                    <span className="font-semibold">{worker.name}</span> - {worker.email}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Total Budget</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Total:</span>
                            <span className="text-2xl font-bold text-primary-600">${totalBudget.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-primary-600 h-4 rounded-full"
                                style={{ width: `${(usedBudget / totalBudget) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Used: ${usedBudget.toLocaleString()}</span>
                            <span>Remaining: ${(totalBudget - usedBudget).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Budget Distribution</h3>
                        <Doughnut data={doughnutData} />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Budget Usage Over Time</h3>
                        <Line data={lineData} />
                    </div>
                </div>
            </div>
        );
    };

    const renderDetails = () => (
        <div className="space-y-6">
            {ndisPlan.fundingCategories && Object.entries(ndisPlan.fundingCategories).map(([category, total]) => {
                const used = total.used || 0;
                const { icon: StatusIcon, color, message } = getBudgetStatus(used, total.total || total);
                return (
                    <div key={category} className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">{category}</h3>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Total Budget:</span>
                            <span className="text-xl font-bold text-primary-600">
                                {total.total ? `$${total.total.toLocaleString()}` : total ? `$${total.toLocaleString()}` : 'N/A'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div 
                                className="bg-primary-600 h-4 rounded-full" 
                                style={{ width: total.total ? `${(used / total.total) * 100}%` : '0%' }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>Used: {used ? `$${used.toLocaleString()}` : 'N/A'}</span>
                            <span>Remaining: {total.total ? `$${(total.total - used).toLocaleString()}` : total ? `$${(total - used).toLocaleString()}` : 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                            <StatusIcon className={`mr-2 ${color}`} />
                            <span className={color}>{message}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    const renderGoals = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ndisPlan.goals && ndisPlan.goals.map((goal, index) => (
                <div key={index} className="card shadow-lg compact bg-base-100">
                    <div className="card-body">
                        <h3 className="card-title text-primary">{goal.category}</h3>
                        <p className="text-gray-700 mb-4">{goal.description}</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary btn-sm">Edit</button>
                            <button className="btn btn-secondary btn-sm">View</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-gray-100 rounded-xl p-8 max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-3xl font-bold mb-6 text-primary-600">NDIS Plan Details</h2>
                <div className="flex mb-6 space-x-4 border-b border-gray-300">
                    <button 
                        className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        <FaChartLine className="inline mr-2" />
                        Overview
                    </button>
                    <button 
                        className={`pb-2 px-4 ${activeTab === 'details' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('details')}
                    >
                        <FaInfoCircle className="inline mr-2" />
                        Funding Details
                    </button>
                    <button 
                        className={`pb-2 px-4 ${activeTab === 'goals' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}
                        onClick={() => setActiveTab('goals')}
                    >
                        <FaCalendarAlt className="inline mr-2" />
                        Goals
                    </button>
                </div>

                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'details' && renderDetails()}
                {activeTab === 'goals' && renderGoals()}

                <div className="mt-8 flex justify-end">
                    <button className="btn btn-primary px-6 py-3 text-lg" onClick={onClose}>Close</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default NDISPlanModal;
