import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => page > 1 && onPageChange(page - 1)}
        disabled={page === 1}
        className={`flex items-center justify-center px-3 py-2 rounded-lg border ${
          page === 1
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-100"
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Page Numbers */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-4 py-2 rounded-lg border font-medium ${
            p === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 hover:bg-blue-50 border-gray-300"
          }`}
        >
          {p}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => page < totalPages && onPageChange(page + 1)}
        disabled={page === totalPages}
        className={`flex items-center justify-center px-3 py-2 rounded-lg border ${
          page === totalPages
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-blue-100"
        }`}
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Pagination;
