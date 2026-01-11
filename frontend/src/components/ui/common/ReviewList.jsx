import React from "react";

const ReviewList = ({ reviews = [] }) => {
  if (!reviews.length) {
    return <div className="text-gray-500 text-sm">No reviews yet.</div>;
  }
  return (
    <div className="space-y-4">
      {reviews.map((r, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-800">{r.student}</span>
            <span className="text-xs text-gray-500">on {r.course}</span>
            <span className="ml-auto text-yellow-500 font-bold">{'★'.repeat(r.rating)}</span>
          </div>
          <div className="text-gray-700 text-sm mb-1">{r.comment}</div>
          <div className="text-xs text-gray-400">{r.date}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
