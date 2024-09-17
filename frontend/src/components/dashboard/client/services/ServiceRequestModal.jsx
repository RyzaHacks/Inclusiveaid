import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimesCircle, FaComments, FaCalendar, FaClock, FaDollarSign, FaInfoCircle, FaMapMarkerAlt } from 'react-icons/fa';

const ServiceRequestModal = ({ isOpen, onClose, onSubmit, services = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    duration: '',
    date: '',
    time: '',
    location: '',
    recurringPattern: '',
    notes: ''
  });
  const [isCustomName, setIsCustomName] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleServiceChange = (name) => {
    if (name === 'custom') {
      setIsCustomName(true);
      setFormData({ ...formData, name: '' });
    } else {
      setIsCustomName(false);
      const selectedService = services.find(service => service.name === name);
      setFormData({
        ...formData,
        name,
        category: selectedService?.category || '',
        price: selectedService?.price || '',
        duration: selectedService?.duration || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = ['name', 'category', 'price', 'duration', 'date', 'time'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      const formattedData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        date: new Date(formData.date).toISOString().split('T')[0],
        status: 'requested'
      };

      await onSubmit(formattedData);
      resetForm();
    } catch (error) {
      console.error('Error submitting service request:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      duration: '',
      date: '',
      time: '',
      location: '',
      recurringPattern: '',
      notes: ''
    });
    setIsCustomName(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 md:p-8 max-w-5xl w-full shadow-lg overflow-y-auto max-h-[90vh]"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
      >
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-primary-600">Request Service</h2>
          <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
            <FaTimesCircle className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="name">
                Service Name
              </label>
              <select
                id="name"
                name="name"
                className="select select-bordered w-full"
                value={isCustomName ? 'custom' : formData.name}
                onChange={(e) => handleServiceChange(e.target.value)}
                required
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
                <option value="custom">Other (Enter Custom Service Name)</option>
              </select>
              {isCustomName && (
                <input
                  type="text"
                  id="customName"
                  name="name"
                  className="input input-bordered w-full mt-2"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter custom service name"
                  required
                />
              )}
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="category">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                className="input input-bordered w-full"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="price">
                <FaDollarSign className="inline mr-1 md:mr-2" />Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="input input-bordered w-full"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="duration">
                <FaClock className="inline mr-1 md:mr-2" />Duration (minutes)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                className="input input-bordered w-full"
                value={formData.duration}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="date">
                <FaCalendar className="inline mr-1 md:mr-2" />Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                className="input input-bordered w-full"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="time">
                <FaClock className="inline mr-1 md:mr-2" />Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                className="input input-bordered w-full"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="location">
                <FaMapMarkerAlt className="inline mr-1 md:mr-2" />Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="input input-bordered w-full"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="recurringPattern">
                <FaInfoCircle className="inline mr-1 md:mr-2" />Recurring Pattern
              </label>
              <input
                type="text"
                id="recurringPattern"
                name="recurringPattern"
                className="input input-bordered w-full"
                value={formData.recurringPattern}
                onChange={handleChange}
                placeholder="e.g., Every Monday"
              />
            </div>
            <div className="bg-gray-100 p-4 md:p-6 rounded-lg shadow-md flex flex-col col-span-1 sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-1 md:mb-2" htmlFor="notes">
                <FaComments className="inline mr-1 md:mr-2" />Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                className="textarea textarea-bordered w-full"
                rows="3"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end mt-4 md:mt-6">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Submit Request
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ServiceRequestModal;
