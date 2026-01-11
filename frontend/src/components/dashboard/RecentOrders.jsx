import React from 'react';

const RecentOrders = ({ orders = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Recent Orders</h3>
      {orders.length === 0 ? (
        <div className="text-sm text-gray-500">No recent orders</div>
      ) : (
        <div className="space-y-2">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <div className="font-medium">{o.title}</div>
                <div className="text-xs text-gray-500">{o.sub}</div>
              </div>
              <div className="text-sm font-semibold">{o.amount}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
