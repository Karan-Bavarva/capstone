import React, { useState, useEffect } from "react";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";
import { server } from "../../utils/config";

const DOCUMENT_TYPES = ["ADDRESS_PROOF", "PHOTO_ID"];

export default function UpdateProfile() {
  const { user, updateProfile, updatePassword, btnLoading, uploadKyc } =
    UserData();

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [kycFiles, setKycFiles] = useState([]);
  const [kycUploading, setKycUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Name and email are required");
      return;
    }

    await updateProfile({ name, email });
  };

  const handlePasswordChange = () => {
    if (!oldPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }

    updatePassword(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
  };

  const handleKycUpload = async () => {
    if (kycFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    const files = kycFiles.map((f) => f.file).filter(Boolean);
    const types = kycFiles.map((f) => f.type).filter(Boolean);

    if (files.length !== types.length) {
      toast.error("Please select both file and type");
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

  const uploadedTypes = (user?.kyc?.documents || []).map((d) => d.type);

  const addKycRow = () => {
    if (kycFiles.length + (user?.kyc?.documents?.length || 0) >= 2) return;
    setKycFiles((prev) => [...prev, { file: null, type: "" }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Account</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-1/4 bg-white rounded-xl shadow p-4">
          <ul className="space-y-2">
            {["profile", "password", "kyc"].map(
              (tab) =>
                (tab !== "kyc" ||
                  (user?.role === "TUTOR" &&
                    user?.status === "KYC_PENDING")) && (
                  <li
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer p-3 rounded-lg font-semibold ${
                      activeTab === tab
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {tab === "profile"
                      ? "Profile"
                      : tab === "password"
                      ? "Change Password"
                      : "Upload KYC"}
                  </li>
                )
            )}
          </ul>
        </div>

        {/* Content */}
        <div className="w-full md:w-3/4 space-y-6">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-6">Profile Information</h3>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  type="email"
                  className="w-full px-4 py-3 border rounded-lg"
                />
                <button
                  disabled={btnLoading}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg"
                >
                  {btnLoading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          )}

          {/* Password */}
          {activeTab === "password" && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-bold mb-6">Change Password</h3>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-3"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg mb-4"
              />
              <button
                onClick={handlePasswordChange}
                disabled={btnLoading}
                className="bg-green-600 text-white px-6 py-3 rounded-lg"
              >
                Update Password
              </button>
            </div>
          )}

          {/* KYC */}
          {activeTab === "kyc" && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Upload KYC</h3>

              {/* Already uploaded documents (PENDING) */}
              {user?.kyc?.documents?.map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 mb-3">
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

              {/* New uploads */}
              {kycFiles.map((f, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  {/* Document Type */}
                  <select
                    value={f.type}
                    onChange={(e) => {
                      const updated = [...kycFiles];
                      updated[i].type = e.target.value;
                      setKycFiles(updated);
                    }}
                    className="flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-400"
                  >
                    <option value="">Select Type</option>
                    {DOCUMENT_TYPES.filter(
                      (t) =>
                        !uploadedTypes.includes(t) &&
                        !kycFiles.some(
                          (x, index) => x.type === t && index !== i
                        )
                    ).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>

                  {/* File upload */}
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
                        toast.error("Only PDF or image files are allowed");
                        return;
                      }

                      const updated = [...kycFiles];
                      updated[i].file = file;
                      setKycFiles(updated);
                    }}
                  />

                  {/* Remove row */}
                  <button
                    type="button"
                    className="text-red-500 font-bold text-lg"
                    onClick={() =>
                      setKycFiles((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add row (max 2 total including uploaded) */}
              {kycFiles.length + (user?.kyc?.documents?.length || 0) < 2 && (
                <button
                  onClick={addKycRow}
                  className="mb-4 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  + Add Row
                </button>
              )}

              {/* Upload button */}
              <button
                onClick={handleKycUpload}
                disabled={kycUploading || kycFiles.length === 0}
                className="block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg disabled:opacity-50"
              >
                {kycUploading ? "Uploading..." : "Upload KYC"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
