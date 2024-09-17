import React, { useState, useEffect } from 'react';
import { FaEdit, FaUserPlus, FaSearch, FaFilter, FaSave, FaTimes, FaChartLine, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import api from '../../../utils/api';

const AdminNDISPlanManagement = () => {
  const [plansData, setPlansData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [serviceWorkers, setServiceWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editedPlan, setEditedPlan] = useState(null);
  const [loadingServiceWorkers, setLoadingServiceWorkers] = useState(true);

  useEffect(() => {
    fetchAllNDISPlans();
    fetchServiceWorkers();
  }, []);

  const fetchAllNDISPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/ndis-plans/admin/all-ndis-plans');
      setPlansData(response.data);
    } catch (err) {
      console.error('Error fetching NDIS plans:', err);
      setError(`Failed to load NDIS plans. ${err.response?.data?.message || err.message || 'Unknown error occurred'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceWorkers = async () => {
    try {
      setLoadingServiceWorkers(true);
      const response = await api.get('/ndis-plans/admin/available-service-workers');
      setServiceWorkers(response.data);
    } catch (err) {
      console.error('Error fetching service workers:', err);
    } finally {
      setLoadingServiceWorkers(false);
    }
  };

  const handleAssignServiceWorker = async () => {
    if (!selectedWorker) {
      alert('Please select a service worker');
      return;
    }
    try {
      await api.post('/ndis-plans/admin/assign-service-worker', {
        planId: selectedPlan.id,
        workerId: selectedWorker
      });
      fetchAllNDISPlans();
      setShowAssignModal(false);
      setSelectedWorker('');
    } catch (err) {
      console.error('Error assigning service worker:', err);
      alert(`Failed to assign service worker. ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const handleEditPlan = (plan) => {
    setSelectedPlan(plan);
    setEditedPlan({
      ...plan,
      userId: plan.client.id,
      startDate: plan.startDate.split('T')[0],
      endDate: plan.endDate.split('T')[0],
      reviewDate: plan.reviewDate ? plan.reviewDate.split('T')[0] : '',
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await api.put(`/ndis-plans/admin/${editedPlan.id}`, {
        totalBudget: parseFloat(editedPlan.totalBudget),
        usedBudget: parseFloat(editedPlan.usedBudget),
        startDate: editedPlan.startDate,
        endDate: editedPlan.endDate,
        status: editedPlan.status,
        reviewDate: editedPlan.reviewDate,
        goals: editedPlan.goals,
        fundingCategories: editedPlan.fundingCategories,
        leaderId: editedPlan.leaderId
      });

      if (response.data) {
        fetchAllNDISPlans();
        setShowEditModal(false);
      } else {
        throw new Error('Failed to update NDIS plan');
      }
    } catch (err) {
      console.error('Error updating NDIS plan:', err);
      alert(`Failed to update NDIS plan. ${err.response?.data?.message || err.message || 'Please try again.'}`);
    }
  };

  const filteredPlans = plansData.filter(plan => 
    (plan.client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.leader?.user?.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || plan.status === statusFilter)
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">NDIS Plan Management</h1>
        
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>}
        
        {loading ? (
          <div className="text-center py-4">Loading NDIS plans...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                    <FaChartLine size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Total Plans</p>
                    <p className="text-2xl font-semibold">{plansData.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                    <FaCalendarAlt size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Active Plans</p>
                    <p className="text-2xl font-semibold">{plansData.filter(plan => plan.status === 'active').length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-500 text-white mr-4">
                    <FaDollarSign size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 uppercase">Total Budget</p>
                    <p className="text-2xl font-semibold">
                      ${plansData.reduce((sum, plan) => sum + parseFloat(plan.totalBudget || 0), 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6"><div className="flex flex-col md:flex-row justify-between items-center mb-4">
                  <div className="flex items-center w-full md:w-auto mb-4 md:mb-0">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Search plans..."
                      className="w-full md:w-64 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center w-full md:w-auto">
                    <FaFilter className="text-gray-400 mr-2" />
                    <select
                      className="w-full md:w-48 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used Budget</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Worker</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPlans.length > 0 ? (
                        filteredPlans.map((plan) => (
                          <tr key={plan.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">{plan.user?.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${plan.totalBudget?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">${plan.usedBudget?.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(plan.startDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{new Date(plan.endDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                plan.status === 'active' ? 'bg-green-100 text-green-800' :
                                plan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{plan.assignedServiceWorker ? plan.assignedServiceWorker.user.name : 'Not assigned'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-indigo-600 hover:text-indigo-900 mr-3" onClick={() => { setSelectedPlan(plan); setShowAssignModal(true); }}>
                                <FaUserPlus className="inline mr-1" /> Assign
                              </button>
                              <button className="text-green-600 hover:text-green-900" onClick={() => handleEditPlan(plan)}>
                                <FaEdit className="inline mr-1" /> Edit
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                            No NDIS plans found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Assign Service Worker Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="assign-modal">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Assign Service Worker to {selectedPlan?.user?.name}'s Plan</h3>
            <select
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onChange={(e) => setSelectedWorker(e.target.value)}
              value={selectedWorker}
            >
              <option value="" disabled>Choose a service worker</option>
              {serviceWorkers.map(worker => (
                <option key={worker.id} value={worker.id}>{worker.user?.name}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className={`px-4 py-2 ${selectedWorker ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded`}
                onClick={handleAssignServiceWorker}
                disabled={!selectedWorker}
              >
                Assign
              </button>
              <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={() => setShowAssignModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

{/* Edit Plan Modal */}
{showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="edit-modal">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold mb-4">Edit NDIS Plan for {editedPlan?.user?.name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Total Budget</label>
                <input
                  type="number"
                  value={editedPlan?.totalBudget}
                  onChange={(e) => setEditedPlan({ ...editedPlan, totalBudget: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Used Budget</label>
                <input
                  type="number"
                  value={editedPlan?.usedBudget}
                  onChange={(e) => setEditedPlan({ ...editedPlan, usedBudget: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={editedPlan?.startDate}
                  onChange={(e) => setEditedPlan({ ...editedPlan, startDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={editedPlan?.endDate}
                  onChange={(e) => setEditedPlan({ ...editedPlan, endDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Review Date</label>
                <input
                  type="date"
                  value={editedPlan?.reviewDate}
                  onChange={(e) => setEditedPlan({ ...editedPlan, reviewDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editedPlan?.status}
                  onChange={(e) => setEditedPlan({ ...editedPlan, status: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Goals</label>
                <textarea
                  value={Array.isArray(editedPlan?.goals) ? editedPlan.goals.join(', ') : editedPlan?.goals}
                  onChange={(e) => setEditedPlan({ ...editedPlan, goals: e.target.value.split(', ') })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Funding Categories</label>
                <textarea
                  value={JSON.stringify(editedPlan?.fundingCategories, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditedPlan({ ...editedPlan, fundingCategories: parsed });
                    } catch (error) {
                      console.error('Invalid JSON:', error);
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={handleSaveEdit}
              >
                <FaSave className="inline mr-2" /> Save Changes
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={() => setShowEditModal(false)}
              >
                <FaTimes className="inline mr-2" /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNDISPlanManagement;