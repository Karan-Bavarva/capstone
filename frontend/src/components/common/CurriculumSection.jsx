import React, { useState } from "react";
import { ChevronDown, ChevronUp, Play } from "lucide-react";


const CurriculumSection = ({ lectures = [], curriculum = [] }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
      <h2 className="text-2xl font-semibold mb-4">Course Curriculum</h2>

      {/* Curriculum key (modules/topics) */}
      {Array.isArray(curriculum) && curriculum.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-green-700">Modules / Topics</h3>
          <ul className="list-disc pl-6 text-gray-800">
            {curriculum.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Lectures */}
      {lectures.length > 0 ? (
        <div className="divide-y">
          {lectures.map((lec, idx) => (
            <div key={lec._id || idx}>
              <button
                className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="flex items-center gap-2 font-medium text-lg">
                  <Play size={18} className="text-green-600" />
                  {lec.title}
                </span>
                {openIndex === idx ? <ChevronUp /> : <ChevronDown />}
              </button>
              {openIndex === idx && (
                <div className="pl-8 pb-4 text-gray-700">
                  <p className="mb-2">{lec.description || "No description."}</p>
                  <p className="text-sm text-gray-500">Duration: {lec.duration || "—"} mins</p>
                  {lec.isPreview && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Preview</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No lectures available.</p>
      )}
    </div>
  );
};

export default CurriculumSection;
