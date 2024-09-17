// AddEditServiceModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const AddEditServiceModal = ({ isOpen, onClose, onSubmit, title, initialData = null }) => {
  const [step, setStep] = useState(1);
  const [serviceData, setServiceData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    if (initialData) {
      setServiceData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(serviceData);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-base-100 rounded-lg shadow-xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-primary">{title}</h2>
            <button onClick={onClose} className="btn btn-ghost btn-circle">
              <FaTimes size={24} />
            </button>
          </div>
          <ul className="steps steps-horizontal w-full mb-6">
            <li className={`step ${step >= 1 ? 'step-primary' : ''}`}>Basic Info</li>
            <li className={`step ${step >= 2 ? 'step-primary' : ''}`}>Details</li>
            <li className={`step ${step >= 3 ? 'step-primary' : ''}`}>Confirm</li>
          </ul>
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Service Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={serviceData.name}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Category</span>
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={serviceData.category}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={serviceData.description}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-24"
                    required
                  ></textarea>
                </div>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Price</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={serviceData.price}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Duration (minutes)</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={serviceData.duration}
                    onChange={handleChange}
                    className="input input-bordered"
                    required
                  />
                </div>
              </div>
            )}
            {step === 3 && (
              <div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Status</span>
                  </label>
                  <select
                    name="status"
                    value={serviceData.status}
                    onChange={handleChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Review Information</h3>
                  <p><strong>Name:</strong> {serviceData.name}</p>
                  <p><strong>Category:</strong> {serviceData.category}</p>
                  <p><strong>Description:</strong> {serviceData.description}</p>
                  <p><strong>Price:</strong> ${serviceData.price}</p>
                  <p><strong>Duration:</strong> {serviceData.duration} minutes</p>
                  <p><strong>Status:</strong> {serviceData.status}</p>
                </div>
              </div>
            )}
            <div className="modal-action">
              {step > 1 && (
                <button type="button" className="btn btn-outline" onClick={prevStep}>
                  <FaArrowLeft className="mr-2" /> Previous
                </button>
              )}
              {step < 3 ? (
                <button type="button" className="btn btn-primary" onClick={nextStep}>
                  Next <FaArrowRight className="ml-2" />
                </button>
              ) : (
                <button type="submit" className="btn btn-primary">
                  {initialData ? 'Update' : 'Add'} Service
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AddEditServiceModal;