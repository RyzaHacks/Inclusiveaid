import React, { useState, useCallback, useMemo } from 'react';
import { FaUserClock, FaClipboardList, FaCalendarAlt, FaChartLine, FaUsers, FaUserNurse, FaCogs, FaHandshake } from 'react-icons/fa';
import { useServiceCoordination } from '../../../hooks/consolidated/useServiceCoordination';
import ServiceEditModal from './components/ServiceEditModal';
import AssignmentEditModal from './components/AssignmentEditModal';
import AppointmentWizard from './components/AppointmentWizard';
import ServiceWorkerAssignmentWizard from './components/ServiceWorkerAssignmentWizard';

const ServiceCoordinationView = () => {
  const { 
    data, 
    loading, 
    error, 
    refreshData,
    updateService, 
    updateAssignment, 
    deleteAssignment, 
    createAssignment,
    updateServiceWorkerAssignments
  } = useServiceCoordination();
  
  const [editingService, setEditingService] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [isAppointmentWizardOpen, setIsAppointmentWizardOpen] = useState(false);
  const [isServiceWorkerWizardOpen, setIsServiceWorkerWizardOpen] = useState(false);

  const handleServiceEdit = useCallback((service) => {
    setEditingService(service);
  }, []);

  const handleAssignmentEdit = useCallback((assignment) => {
    setEditingAssignment(assignment);
  }, []);

  const handleServiceSave = useCallback(async (updatedService) => {
    await updateService(updatedService);
    setEditingService(null);
    refreshData();
  }, [updateService, refreshData]);

  const handleAssignmentSave = useCallback(async (updatedAssignment) => {
    await updateAssignment(updatedAssignment);
    setEditingAssignment(null);
    refreshData();
  }, [updateAssignment, refreshData]);

  const handleCreateAppointment = useCallback(async (newAppointment) => {
    await createAssignment(newAppointment);
    setIsAppointmentWizardOpen(false);
    refreshData();
  }, [createAssignment, refreshData]);

  const handleUpdateServiceWorkerAssignment = useCallback(async (serviceWorkerId, assignedServiceIds) => {
    await updateServiceWorkerAssignments(serviceWorkerId, assignedServiceIds);
    setIsServiceWorkerWizardOpen(false);
    refreshData();
  }, [updateServiceWorkerAssignments, refreshData]);

  const handleDeleteAssignment = useCallback(async (assignmentId) => {
    await deleteAssignment(assignmentId);
    refreshData();
  }, [deleteAssignment, refreshData]);

  const renderDashboardCard = useCallback(({ icon: Icon, title, value, color }) => (
    <div className={`card bg-white shadow-xl`}>
      <div className="card-body">
        <h2 className={`card-title flex items-center text-xl mb-4`}>
          <Icon className={`mr-2 text-${color}-500`} /> {title}
        </h2>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  ), []);

  const memoizedDashboardCards = useMemo(() => [
    { icon: FaUsers, title: "Active Clients", value: data.activeClients.length, color: "blue" },
    { icon: FaClipboardList, title: "Pending Tasks", value: data.pendingTasks.length, color: "orange" },
    { icon: FaCalendarAlt, title: "Upcoming Appointments", value: data.upcomingAppointments.length, color: "green" },
    { icon: FaChartLine, title: "Service Metrics", value: data.serviceMetrics ? `${data.serviceMetrics.activeServices} Active Services` : 'N/A', color: "purple" },
    { icon: FaHandshake, title: "Support Team", value: data.supportTeam.length, color: "teal" },
    { icon: FaCogs, title: "Service Management", value: data.services.length, color: "gray" },
  ], [data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Service Coordination Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memoizedDashboardCards.map((card, index) => (
          <React.Fragment key={`dashboard-card-${index}`}>
            {renderDashboardCard(card)}
          </React.Fragment>
        ))}
      </div>

      {/* Appointments Management Card */}
      <div className="card bg-white shadow-xl col-span-full mt-6">
        <div className="card-body">
          <h2 className="card-title flex items-center text-xl mb-4">
            <FaCalendarAlt className="mr-2 text-purple-500" /> Appointments Management
          </h2>
          <button 
            className="btn btn-primary mb-4"
            onClick={() => setIsAppointmentWizardOpen(true)}
          >
            Create New Appointment
          </button>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Service</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.assignments.map((assignment) => (
                  <tr key={`assignment-${assignment.id}`}>
                    <td>{assignment.client.name}</td>
                    <td>{assignment.service.name}</td>
                    <td>{new Date(assignment.dateTime).toLocaleString()}</td>
                    <td>{assignment.status}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary mr-2"
                        onClick={() => handleAssignmentEdit(assignment)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-xs btn-secondary"
                        onClick={() => handleDeleteAssignment(assignment.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Service Worker Assignments Card */}
      <div className="card bg-white shadow-xl col-span-full mt-6">
        <div className="card-body">
          <h2 className="card-title flex items-center text-xl mb-4">
            <FaUserNurse className="mr-2 text-green-500" /> Service Worker Assignments
          </h2>
          <button 
            className="btn btn-primary mb-4"
            onClick={() => setIsServiceWorkerWizardOpen(true)}
          >
            Manage Service Worker Assignments
          </button>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Service Worker</th>
                  <th>Assigned Services</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.serviceWorkers.map((worker) => (
                  <tr key={`service-worker-${worker.id}`}>
                    <td>{worker.user ? worker.user.name : ''}</td>
                    <td>{worker.assignedServices ? worker.assignedServices.map(service => service.name).join(', ') : ''}</td>
                    <td>
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => setIsServiceWorkerWizardOpen(true)}
                      >
                        Edit Assignments
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ServiceEditModal
        isOpen={editingService !== null}
        onClose={() => setEditingService(null)}
        service={editingService}
        onSave={handleServiceSave}
      />

<AssignmentEditModal
  isOpen={editingAssignment !== null}
  onClose={() => setEditingAssignment(null)}
  assignment={editingAssignment}
  onSave={handleAssignmentSave}
  clients={data.clients}
  serviceWorkers={data.serviceWorkers}
  services={data.services}
/>

      <AppointmentWizard
        isOpen={isAppointmentWizardOpen}
        onClose={() => setIsAppointmentWizardOpen(false)}
        onSave={handleCreateAppointment}
        clients={data.clients}
        serviceWorkers={data.serviceWorkers}
        services={data.services}
      />

      <ServiceWorkerAssignmentWizard
        isOpen={isServiceWorkerWizardOpen}
        onClose={() => setIsServiceWorkerWizardOpen(false)}
        onSave={handleUpdateServiceWorkerAssignment}
        serviceWorkers={data.serviceWorkers}
        services={data.services}
      />
    </div>
  );
};

export default ServiceCoordinationView;