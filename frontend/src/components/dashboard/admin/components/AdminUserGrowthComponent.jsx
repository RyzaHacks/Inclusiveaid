import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminUserGrowthComponent = ({ data }) => {
  console.log("AdminUserGrowthComponent received data:", data);

  if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col justify-center items-center h-64">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">User Growth</h3>
        <p className="text-gray-500 text-center">No user growth data available.</p>
      </div>
    );
  }

  const chartData = {
    labels: data.data.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [{
      label: 'New Users',
      data: data.data.map(item => item.count),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of New Users'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'User Growth Over Time'
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-64">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">User Growth</h3>
      <div className="flex-grow">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AdminUserGrowthComponent;