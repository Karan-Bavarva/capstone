import React from "react";

const NotificationFeed = ({ notifications = [] }) => {
  if (!notifications.length) {
    return <div className="text-gray-500 text-sm">No notifications yet.</div>;
  }
  return (
    <ul className="space-y-3">
      {notifications.map((n, i) => (
        <li key={i} className="bg-white border rounded-lg p-3 shadow-sm flex items-center gap-2">
          <span className="text-blue-500">🔔</span>
          <div>
            <div className="font-medium text-gray-800">{n.title}</div>
            <div className="text-xs text-gray-500">{n.time}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NotificationFeed;
