import { useState } from "react";
import { UserData } from "../../context/UserContext";
import toast from "react-hot-toast";

export default function UserPasswordCard() {
  const { updatePassword, btnLoading } = UserData();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submit = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    updatePassword(oldPassword, newPassword);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="rounded-xl border p-5">
      <h4 className="font-semibold mb-4">Change Password</h4>

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
        className="w-full px-4 py-3 border rounded-lg mb-3"
      />

      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg mb-4"
      />

      <button
        onClick={submit}
        disabled={btnLoading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        Update Password
      </button>
    </div>
  );
}
