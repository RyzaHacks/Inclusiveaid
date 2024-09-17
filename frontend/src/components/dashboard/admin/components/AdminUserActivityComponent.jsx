import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminUserActivityComponent = ({ data }) => {
  console.log("AdminUserActivityComponent received data:", data);

  if (!data || !data.data || !data.data.loginData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">User Activity</h3>
        <p className="text-gray-500">No user activity data available.</p>
      </div>
    );
  }

  const chartData = data.data.loginData;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Login Activity',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Logins'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">User Activity</h3>
      <div style={{ height: '300px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AdminUserActivityComponent;