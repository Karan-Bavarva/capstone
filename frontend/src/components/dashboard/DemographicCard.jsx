import React from 'react';

const DemographicCard = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Demographics</h3>
      <div className="text-sm text-gray-500">Students by country (sample)</div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-2 bg-gray-50 rounded">India <div className="font-bold">60%</div></div>
        <div className="p-2 bg-gray-50 rounded">US <div className="font-bold">25%</div></div>
        <div className="p-2 bg-gray-50 rounded">UK <div className="font-bold">10%</div></div>
        <div className="p-2 bg-gray-50 rounded">Other <div className="font-bold">5%</div></div>
      </div>
    </div>
  );
};

export default DemographicCard;
