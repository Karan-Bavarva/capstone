import React from 'react';

const ChartPlaceholder = ({ title, height = 220 }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {/* placeholder legend */}
        <div className="text-xs text-gray-500">Last 30 days</div>
      </div>
      <div style={{height}} className="w-full bg-gradient-to-r from-gray-100 to-gray-50 rounded" />
    </div>
  );
};

export default ChartPlaceholder;
