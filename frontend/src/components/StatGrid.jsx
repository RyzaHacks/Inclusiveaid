// src/components/StatGrid.js
import React from 'react';
import StatCard from './StatCard';

const StatGrid = ({ stats }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <StatCard key={stat.label} {...stat} />
    ))}
  </div>
);

export default StatGrid;