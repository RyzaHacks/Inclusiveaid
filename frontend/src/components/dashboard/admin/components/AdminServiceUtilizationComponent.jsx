import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const AdminServiceUtilizationComponent = ({ data }) => {
  console.log("AdminServiceUtilizationComponent received data:", data);

  if (!data || !data.data || !data.data.popularServices) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">Service Utilization</h3>
        <p className="text-gray-500">No service utilization data available.</p>
      </div>
    );
  }

  const chartData = {
    labels: data.data.popularServices.labels,
    datasets: data.data.popularServices.datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Popular Services',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Uses'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Services'
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">Service Utilization</h3>
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AdminServiceUtilizationComponent;