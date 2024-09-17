import React from 'react';
import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const GoalTracker = ({ goals }) => {
  return (
    <div className="space-y-4">
      {goals.map((goal, index) => (
        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
          <div>
            <h4 className="font-semibold">{goal.title}</h4>
            <p className="text-sm text-gray-600">{goal.description}</p>
          </div>
          <div className="flex items-center">
            {goal.status === 'completed' ? (
              <FaCheckCircle className="text-green-500 mr-2" />
            ) : (
              <FaExclamationTriangle className="text-yellow-500 mr-2" />
            )}
            <span className="text-sm">{goal.progress}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalTracker;