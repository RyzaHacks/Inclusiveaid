import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCalendar, FaList, FaSearch, FaPlus, FaDownload, FaExclamationTriangle, FaDollarSign, FaChartPie } from 'react-icons/fa';
import ServiceControls from './ServiceControls';
import ServiceList from './ServiceList';  
import Calendar from './Calendar';  
import ServiceRequestModal from './ServiceRequestModal';
import InfoPopup from './InfoPopup';
import DownloadServiceWizard from './DownloadServiceWizard';
import ViewServiceModal from './ViewServiceModal';
import QuickActions from './QuickActions';
import SelectedDateCard from './SelectedDateCard';
import LoadingSpinner from './LoadingSpinner';
import useClientDashboardData from '../../../../hooks/consolidated/useDashboard';

const ClientServicesView = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isWeekView, setIsWeekView] = useState(false);
  const [isServiceRequestModalOpen, setIsServiceRequestModalOpen] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [isDownloadWizardOpen, setIsDownloadWizardOpen] = useState(false);
  const [isViewServicesModalOpen, setIsViewServicesModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'

  const {
    upcomingServices,
    ndisPlan,
    supportTeam,
    loading,
    error,
    scheduleService,
    refreshDashboard
  } = useClientDashboardData(userId);

  useEffect(() => {
    console.log(upcomingServices); // This will help to check if the service name is included in the data.
  }, [upcomingServices]);

  const handleServiceRequest = async (serviceData) => {
    try {
      const requiredFields = ['name', 'category', 'price', 'duration', 'date', 'time'];
      const missingFields = requiredFields.filter(field => !serviceData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
  
      const formattedData = {
        ...serviceData,
        price: parseFloat(serviceData.price),
        duration: parseInt(serviceData.duration),
        date: new Date(serviceData.date).toISOString().split('T')[0],
        status: 'requested'
      };
  
      await scheduleService(formattedData);
      console.log('Service request submitted successfully');
      setIsServiceRequestModalOpen(false);
      setShowInfoPopup(true);
      refreshDashboard();
    } catch (error) {
      console.error('Error submitting service request:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleViewDetails = (service) => {
    setSelectedService(service);
    setIsViewServicesModalOpen(true);
  };

  const filteredServices = upcomingServices.filter(service => {
    const matchesSearch = service.service?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(service.date).toLocaleDateString().includes(searchTerm);
    const matchesTab = activeTab === 'all' || service.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
    setSelectedDate(null);
    setIsWeekView(false);
  };

  const selectDate = (date) => {
    setSelectedDate(date);
    setIsWeekView(true);
  };

  const renderServiceStats = () => {
    const serviceCount = upcomingServices.length;
    const totalCost = upcomingServices.reduce((sum, service) => sum + (parseFloat(service.service?.price) || 0), 0);
    const categoryCounts = upcomingServices.reduce((acc, service) => {
      acc[service.service?.category] = (acc[service.service?.category] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Service Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <FaList className="text-primary-500 mr-2" />
            <span>Total Services: {serviceCount}</span>
          </div>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-2" />
            <span>Total Cost: ${totalCost.toFixed(2)}</span>
          </div>
          <div className="flex items-center">
            <FaChartPie className="text-blue-500 mr-2" />
            <span>Categories: {Object.keys(categoryCounts).length}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <p className="font-bold">Error</p>
          </div>
          <p className="mt-2">{error}</p>
        </motion.div>
      );
    }

    return (
      <div className="flex flex-col gap-8">
        {renderServiceStats()}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 space-y-8">
            <ServiceControls 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setIsServiceRequestModalOpen={setIsServiceRequestModalOpen}
              setIsDownloadWizardOpen={setIsDownloadWizardOpen}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            <AnimatePresence mode="wait">
              {viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ServiceList 
                    services={filteredServices} 
                    onViewDetails={handleViewDetails} 
                    serviceName="serviceName" // Pass the serviceName as a string
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Calendar 
                    currentDate={currentDate}
                    changeMonth={changeMonth}
                    services={filteredServices}
                    onSelectDate={selectDate}
                    selectedDate={selectedDate}
                    isWeekView={isWeekView}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="lg:w-1/3 space-y-8">
            <SelectedDateCard 
              selectedDate={selectedDate}
              setIsServiceRequestModalOpen={setIsServiceRequestModalOpen}
            />
            <QuickActions 
              setIsServiceRequestModalOpen={setIsServiceRequestModalOpen}
              setIsDownloadWizardOpen={setIsDownloadWizardOpen}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-100 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold text-primary-600 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Services Dashboard
      </motion.h1>
      {renderContent()}
      <ServiceRequestModal
        isOpen={isServiceRequestModalOpen}
        onClose={() => setIsServiceRequestModalOpen(false)}
        onSubmit={handleServiceRequest}
        services={upcomingServices}
        availableServiceTypes={ndisPlan?.availableServices || []}
      />
      <InfoPopup 
        showInfoPopup={showInfoPopup}
        setShowInfoPopup={setShowInfoPopup}
      />
      <DownloadServiceWizard
        isOpen={isDownloadWizardOpen}
        onClose={() => setIsDownloadWizardOpen(false)}
        services={filteredServices}
      />
      <ViewServiceModal
        isOpen={isViewServicesModalOpen}
        onClose={() => setIsViewServicesModalOpen(false)}
        service={selectedService}
      />
    </div>
  );
};

export default ClientServicesView;