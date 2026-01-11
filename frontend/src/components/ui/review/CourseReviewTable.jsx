import React from "react";

const CourseReviewTable = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <div className="text-gray-500">No reviews found for this course.</div>;
  }
  return (
    <div className="overflow-x-auto mt-8">
      <table className="min-w-full bg-white border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 border-b text-left">User</th>
            <th className="px-4 py-2 border-b text-center">Rating</th>
            <th className="px-4 py-2 border-b text-left">Review</th>
            <th className="px-4 py-2 border-b text-center">Date</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{review.user?.name || "-"}</td>
              <td className="px-4 py-2 border-b text-center">{review.rating}</td>
              <td className="px-4 py-2 border-b">{review.review || "-"}</td>
              <td className="px-4 py-2 border-b text-center">{review.createdAt ? new Date(review.createdAt).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseReviewTable;
