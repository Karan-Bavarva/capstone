import React from 'react';

const MetricCard = ({ title, value, subtitle, icon }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800 mt-1">{value}</div>
          {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
        </div>
        {icon && <div className="text-3xl text-indigo-600">{icon}</div>}
      </div>
    </div>
  );
};

export default MetricCard;
