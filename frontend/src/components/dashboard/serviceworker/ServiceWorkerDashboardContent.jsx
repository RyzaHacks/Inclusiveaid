import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendar, FaClipboardList } from 'react-icons/fa';
import api from '../../../utils/api';

const ServiceWorkerDashboardContent = ({ userData }) => {
    const [upcomingServices, setUpcomingServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const servicesRes = await api.get('/api/users/services');
                setUpcomingServices(servicesRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard data:', err.response ? err.response.data : err.message);
                setError('Failed to load dashboard data. Please try again later.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="flex items-center justify-center h-full">Loading dashboard data...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            <motion.div
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-between"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <h3 className="text-lg font-semibold mb-2 text-primary-600">Upcoming Services</h3>
                {upcomingServices.length > 0 ? (
                    <ul className="space-y-2 flex-grow">
                        {upcomingServices.slice(0, 2).map((service, index) => (
                            <li key={index} className="flex items-center space-x-2 text-sm bg-gray-50 p-2 rounded-lg">
                                <FaCalendar className="text-primary-500 flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{service.name}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(service.date).toLocaleDateString()}, {new Date(`2000-01-01T${service.time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                <button className="btn btn-xs btn-ghost">Edit</button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 flex-grow">No upcoming services.</p>
                )}
                <button className="mt-2 btn btn-xs btn-outline btn-primary self-start">View All Services</button>
            </motion.div>

            <motion.div
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-primary-600">Service Notes</h3>
                </div>
                <p className="text-sm text-gray-500 flex-grow">Manage your service notes here.</p>
            </motion.div>

            <motion.div
                className="bg-white rounded-xl shadow-lg p-4 flex flex-col"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: 0.3 }}
            >
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-primary-600">Client Information</h3>
                </div>
                <p className="text-sm text-gray-500 flex-grow">Access your client's information here.</p>
            </motion.div>
        </div>
    );
};

export default ServiceWorkerDashboardContent;
