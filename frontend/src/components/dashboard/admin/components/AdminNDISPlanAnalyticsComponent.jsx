import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminNDISPlanAnalyticsComponent = ({ data }) => {
  console.log("AdminNDISPlanAnalyticsComponent received data:", data);

  if (!data || !data.data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-primary-600">NDIS Plan Analytics</h3>
        <p className="text-gray-500">No NDIS plan analytics data available.</p>
      </div>
    );
  }

  const {
    budgetUtilization,
    totalBudget,
    usedBudget,
    remainingBudget,
    activePlansCount,
    averageUtilization
  } = data.data;

  const chartData = {
    labels: budgetUtilization.labels,
    datasets: [{
      data: budgetUtilization.datasets[0].data,
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Budget Utilization',
      },
    },
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-2 text-primary-600">NDIS Plan Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="flex flex-col justify-center">
          <div className="stats stats-vertical shadow">
            <div className="stat">
              <div className="stat-title">Total Budget</div>
              <div className="stat-value text-primary">${totalBudget.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Used Budget</div>
              <div className="stat-value text-secondary">${usedBudget.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Remaining Budget</div>
              <div className="stat-value text-accent">${remainingBudget.toLocaleString()}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Active Plans</div>
              <div className="stat-value">{activePlansCount}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Average Utilization</div>
              <div className="stat-value">{averageUtilization}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNDISPlanAnalyticsComponent;