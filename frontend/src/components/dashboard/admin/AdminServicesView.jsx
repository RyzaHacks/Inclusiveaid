// src/components/dashboard/admin/AdminServicesView.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import useServiceManagement from '../../../hooks/consolidated/useServiceManagement';

const AdminServicesView = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const {
    services,
    categories,
    loading,
    error,
    totalPages,
    currentPage,
    fetchServices,
    createService,
    updateService,
    deleteService
  } = useServiceManagement();

  useEffect(() => {
    fetchServices(1, searchTerm, filterCategory);
  }, [fetchServices, searchTerm, filterCategory]);

  const handleCreateService = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (service) => {
    setCurrentService(service);
    setIsDeleteModalOpen(true);
  };

  const handleServiceSubmit = async (serviceData) => {
    if (currentService) {
      await updateService(currentService.id, serviceData);
    } else {
      await createService(serviceData);
    }
    setIsModalOpen(false);
    fetchServices(currentPage, searchTerm, filterCategory);
  };

  const handleServiceDelete = async () => {
    if (currentService) {
      await deleteService(currentService.id);
      setIsDeleteModalOpen(false);
      fetchServices(currentPage, searchTerm, filterCategory);
    }
  };

  const handlePageChange = (page) => {
    fetchServices(page, searchTerm, filterCategory);
  };

  if (loading) return <div className="text-center">Loading services...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-6">Service Management</h1>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search services..."
              className="input input-bordered pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            className="select select-bordered"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button
          className="btn btn-primary"
          onClick={handleCreateService}
        >
          <FaPlus className="mr-2" /> Add New Service
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td>${typeof service.price === 'number' ? service.price.toFixed(2) : service.price || 'N/A'}</td>
                <td>{service.duration} minutes</td>
                <td>
                  <span className={`badge ${service.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                    {service.status}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleEditService(service)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="btn btn-sm btn-ghost text-red-500"
                      onClick={() => handleDeleteService(service)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleServiceSubmit}
        service={currentService}
        categories={categories}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleServiceDelete}
        title="Delete Service"
        message={`Are you sure you want to delete the service "${currentService?.name}"?`}
      />
    </motion.div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="btn-group mt-4">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`btn ${currentPage === page ? 'btn-active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

const ServiceModal = ({ isOpen, onClose, onSubmit, service, categories }) => {
  const [formData, setFormData] = useState(service || {
    name: '',
    category: '',
    price: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    if (service) {
      setFormData(service);
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        duration: '',
        status: 'active'
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submittedData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      duration: parseInt(formData.duration) || 0
    };
    onSubmit(submittedData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">{service ? 'Edit Service' : 'Create New Service'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                    min="1"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-4">{title}</h2>
              <p className="mb-6">{message}</p>
              <div className="flex justify-end space-x-2">
                <button onClick={onClose} className="btn btn-ghost">Cancel</button>
                <button onClick={onConfirm} className="btn btn-danger">Confirm</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  export default AdminServicesView;