import React from 'react';

const AdminRecentAppointmentsComponent = ({ data }) => {
  console.log("AdminRecentAppointmentsComponent received data:", data);

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">Recent Appointments</h3>
        <p className="text-gray-500">No recent appointments available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">Recent Appointments</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Service</th>
              <th>Client</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((appointment, index) => (
              <tr key={appointment.id || index}>
                <td>{appointment.service?.name || `Service ID: ${appointment.serviceId}`}</td>
                <td>{appointment.client?.name || 'Unknown Client'}</td>
                <td>
                  <span className={`badge ${
                    appointment.status === 'scheduled' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {appointment.status}
                  </span>
                </td>
                <td>{new Date(appointment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRecentAppointmentsComponent;