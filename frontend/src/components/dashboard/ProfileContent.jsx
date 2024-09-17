import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaIdCard, FaBirthdayCake, FaAmbulance, FaCalendar, FaDownload, FaPrint, FaShare, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import api from '../../utils/api';
import { PDFDownloadLink } from '@react-pdf/renderer';
import ProfilePDF from './ProfilePDF';

const ProfileContent = () => {
  const [userData, setUserData] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [services, setServices] = useState([]);
  const [showDownloadWizard, setShowDownloadWizard] = useState(false);
  const [downloadOptions, setDownloadOptions] = useState({
    personalInfo: true,
    services: true,
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/v3/users/profile');
      setUserData(response.data);
      fetchServices(response.data.id);
    } catch (error) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', error);
    }
  };

  const fetchServices = async (userId) => {
    try {
      const response = await api.get(`/api/users/users/${userId}/services`);
      setServices(response.data.services);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/v3/users/profile', editData);
      setUserData(response.data.user);
      setIsEditing(false);
      setEditData(null);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prevData => ({
      ...prevData,
      [name]: value,
      ndisPlan: {
        ...prevData.ndisPlan,
        [name]: value
      }
    }));
  };

  const handleEditClick = () => {
    setEditData(userData);
    setIsEditing(true);
    setSuccess('');
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
    setError('');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert('Sharing functionality to be implemented');
  };

  const toggleDownloadWizard = () => {
    setShowDownloadWizard(!showDownloadWizard);
  };

  const handleDownloadOptionChange = (option) => {
    setDownloadOptions({
      ...downloadOptions,
      [option]: !downloadOptions[option],
    });
  };

  if (!userData) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl overflow-hidden max-w-6xl mx-auto my-8"
    >
      <div className="px-6 py-8 sm:px-10 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div>
            <h2 className="text-4xl font-bold mb-2">User Profile</h2>
            <p className="text-lg opacity-80">Manage your personal information and NDIS details.</p>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button onClick={toggleDownloadWizard} className="bg-white text-primary-600 hover:bg-primary-50 transition-colors px-4 py-2 rounded-full flex items-center">
              <FaDownload className="mr-2" /> Download
            </button>
            <button onClick={handlePrint} className="bg-white text-primary-600 hover:bg-primary-50 transition-colors px-4 py-2 rounded-full flex items-center">
              <FaPrint className="mr-2" /> Print
            </button>
            <button onClick={handleShare} className="bg-white text-primary-600 hover:bg-primary-50 transition-colors px-4 py-2 rounded-full flex items-center">
              <FaShare className="mr-2" /> Share
            </button>
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-center p-4 bg-red-100 border-l-4 border-red-500">{error}</p>}
      {success && <p className="text-green-500 text-center p-4 bg-green-100 border-l-4 border-green-500">{success}</p>}

      {showDownloadWizard && (
        <div className="p-6 bg-gray-100 border-b border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Download Options</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={downloadOptions.personalInfo}
                onChange={() => handleDownloadOptionChange('personalInfo')}
                className="form-checkbox h-5 w-5 text-primary-600"
              />
              <span>Personal Information</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={downloadOptions.services}
                onChange={() => handleDownloadOptionChange('services')}
                className="form-checkbox h-5 w-5 text-primary-600"
              />
              <span>Services</span>
            </label>
          </div>
          <div className="mt-6">
            <PDFDownloadLink 
              document={<ProfilePDF userData={userData} services={services} options={downloadOptions} />} 
              fileName="user_profile.pdf"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Preparing Download...' : 'Download PDF'
              }
            </PDFDownloadLink>
          </div>
        </div>
      )}

      <div className="p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">Personal Information</h3>
              <InputField
                icon={<FaUser />}
                label="Name"
                name="name"
                value={isEditing ? editData.name : userData.name}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                icon={<FaEnvelope />}
                label="Email address"
                name="email"
                value={userData.email}
                disabled={true}
              />
              <InputField
                icon={<FaPhone />}
                label="Phone Number"
                name="phoneNumber"
                value={isEditing ? editData.phoneNumber : userData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                icon={<FaHome />}
                label="Address"
                name="address"
                value={isEditing ? editData.address : userData.address}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800">NDIS Details</h3>
              <InputField
                icon={<FaIdCard />}
                label="NDIS Number"
                name="ndisNumber"
                value={isEditing ? editData.ndisPlan?.ndisNumber : userData.ndisPlan?.ndisNumber}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                icon={<FaBirthdayCake />}
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={isEditing ? editData.dateOfBirth : userData.dateOfBirth}
                onChange={handleChange}
                disabled={!isEditing}
              />
              <InputField
                icon={<FaAmbulance />}
                label="Emergency Contact"
                name="emergencyContact"
                value={isEditing ? editData.emergencyContact : userData.emergencyContact}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="ml-3 inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaTimes className="mr-2" /> Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleEditClick}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FaEdit className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-12 px-8 py-6 bg-gray-50">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          <FaCalendar className="inline mr-3" /> Your Services
        </h3>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 transition-all hover:shadow-lg">
                <h4 className="text-xl font-medium text-gray-800 mb-2">{service.name}</h4>
                <p className="text-sm text-gray-600 mb-4">Category: {service.category}</p>
                {service.client && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Client:</strong> {service.client.name} ({service.client.email})
                  </p>
                )}
                {service.serviceWorker && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Service Worker:</strong> {service.serviceWorker.name} ({service.serviceWorker.email})
                  </p>
                )}
                {service.assignedWorkers && service.assignedWorkers.length > 0 && (
                  <div className="mt-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Assigned Workers:</h5>
                    <ul className="list-disc list-inside">
                      {service.assignedWorkers.map((worker) => (
                        <li key={worker.id} className="text-sm text-gray-600">
                          {worker.name} ({worker.email})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">No services assigned yet.</p>
        )}
      </div>
    </motion.div>
  );
};

const InputField = ({ icon, label, name, value, onChange, disabled, type = "text" }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {icon && <span className="inline-block mr-2">{icon}</span>} {label}
    </label>
    <input
      type={type}
      name={name}
      id={name}
      value={value || ''}
      onChange={onChange}
      disabled={disabled}
      className={`mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${disabled ? 'bg-gray-100' : ''}`}
    />
  </div>
);

export default ProfileContent;