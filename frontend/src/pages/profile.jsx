import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaHome, FaIdCard, FaBirthdayCake, FaAmbulance  } from 'react-icons/fa';
import api from '../utils/api';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/v3/users/profile');
        setUserData(response.data);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/v3/users/profile', userData);
      setUserData(response.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  if (!userData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-100 to-secondary-100 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="px-4 py-5 sm:px-6 bg-primary-600 text-white">
          <h2 className="text-2xl font-bold">User Profile</h2>
          <p className="mt-1 text-sm">Manage your personal information and NDIS details.</p>
        </div>
        {error && <p className="text-red-500 text-center p-2 bg-red-100">{error}</p>}
        {success && <p className="text-green-500 text-center p-2 bg-green-100">{success}</p>}
        <div className="border-t border-gray-200">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    <FaUser className="inline mr-2" /> Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={userData.name || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    <FaEnvelope className="inline mr-2" /> Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userData.email || ''}
                    disabled
                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    <FaPhone className="inline mr-2" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={userData.phoneNumber || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    <FaHome className="inline mr-2" /> Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={userData.address || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="ndisNumber" className="block text-sm font-medium text-gray-700">
                    <FaIdCard className="inline mr-2" /> NDIS Number
                  </label>
                  <input
                    type="text"
                    name="ndisNumber"
                    id="ndisNumber"
                    value={userData.ndisNumber || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                    <FaBirthdayCake className="inline mr-2" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={userData.dateOfBirth || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                <div className="col-span-6">
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">
                    <FaAmbulance className="inline mr-2" /> Emergency Contact
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    id="emergencyContact"
                    value={userData.emergencyContact || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;