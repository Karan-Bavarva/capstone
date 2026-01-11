import { useState } from "react";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { server } from "../../utils/config";

const DOCUMENT_TYPES = ["ADDRESS_PROOF", "PHOTO_ID"];

export default function UserKycCard() {
  const { user, uploadKyc } = UserData();

  const [kycFiles, setKycFiles] = useState([]);
  const [kycUploading, setKycUploading] = useState(false);

  const uploadedTypes = (user?.kyc?.documents || []).map((d) => d.type);

  const addRow = () => {
    if (kycFiles.length + uploadedTypes.length >= 2) return;
    setKycFiles((prev) => [...prev, { file: null, type: "" }]);
  };

  const removeRow = (index) => {
    setKycFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (kycFiles.length === 0) {
      toast.error("Please add at least one document");
      return;
    }

    const files = kycFiles.map((f) => f.file).filter(Boolean);
    const types = kycFiles.map((f) => f.type).filter(Boolean);

    if (files.length !== types.length) {
      toast.error("Please select both file and document type");
      return;
    }

    setKycUploading(true);
    const res = await uploadKyc(user.id, files, types);
    setKycUploading(false);

    if (res?.status) {
      toast.success("KYC uploaded successfully");
      setKycFiles([]);
    } else {
      toast.error(res?.message || "KYC upload failed");
    }
  };

  // Show KYC only for Tutor & pending users
  if (user?.role !== "TUTOR" || user?.status !== "KYC_PENDING") {
    return null;
  }

  return (
    <div className="rounded-xl border p-5">
      <h4 className="font-semibold text-gray-800 mb-4">
        KYC Verification
      </h4>

      {/* Already uploaded documents */}
      {user?.kyc?.documents?.length > 0 && (
        <div className="mb-6 space-y-3">
          {user.kyc.documents.map((doc) => (
            <div
              key={doc._id}
              className="flex items-center gap-4"
            >
              <input
                value={doc.type}
                disabled
                className="flex-1 px-4 py-3 border rounded-lg bg-gray-100"
              />

              <a
                href={`${server}${doc.file}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-semibold hover:underline"
              >
                View
              </a>
            </div>
          ))}
        </div>
      )}

      {/* New uploads */}
      {kycFiles.map((row, index) => (
        <div
          key={index}
          className="flex items-center gap-4 mb-4"
        >
          {/* Document Type */}
          <select
            value={row.type}
            onChange={(e) => {
              const updated = [...kycFiles];
              updated[index].type = e.target.value;
              setKycFiles(updated);
            }}
            className="flex-1 px-4 py-3 border rounded-lg"
          >
            <option value="">Select Type</option>
            {DOCUMENT_TYPES.filter(
              (t) =>
                !uploadedTypes.includes(t) &&
                !kycFiles.some(
                  (x, i) => x.type === t && i !== index
                )
            ).map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* File Upload */}
          <input
            type="file"
            accept="image/*,application/pdf"
            className="flex-1 px-4 py-3 border rounded-lg"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              const isImage = file.type.startsWith("image/");
              const isPdf = file.type === "application/pdf";

              if (!isImage && !isPdf) {
                toast.error("Only image or PDF files allowed");
                return;
              }

              const updated = [...kycFiles];
              updated[index].file = file;
              setKycFiles(updated);
            }}
          />

          {/* Remove */}
          <button
            type="button"
            onClick={() => removeRow(index)}
            className="text-red-500 font-bold text-lg"
          >
            ✕
          </button>
        </div>
      ))}

      {/* Add Row */}
      {kycFiles.length + uploadedTypes.length < 2 && (
        <button
          onClick={addRow}
          className="mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          + Add Document
        </button>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={kycUploading || kycFiles.length === 0}
        className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50"
      >
        {kycUploading ? "Uploading..." : "Upload KYC"}
      </button>
    </div>
  );
}
