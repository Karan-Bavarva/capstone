import { useEffect, useState } from "react";
import { UserData } from "../../context/UserContext";

export default function UserInfoCard() {
  const { user, updateProfile, btnLoading } = UserData();

  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        title: user.title || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    updateProfile(form);
  };

  return (
    <form onSubmit={submit} className="rounded-xl border p-5 space-y-4">
      <h4 className="font-semibold text-gray-800">
        Personal Information
      </h4>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="w-full px-4 py-3 border rounded-lg"
      />

      <input
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full px-4 py-3 border rounded-lg"
      />

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Professional Title"
        className="w-full px-4 py-3 border rounded-lg"
      />

      <textarea
        name="bio"
        value={form.bio}
        onChange={handleChange}
        placeholder="Short Bio"
        rows={4}
        className="w-full px-4 py-3 border rounded-lg"
      />

      <button
        disabled={btnLoading}
        className="bg-green-600 text-white px-6 py-2 rounded-lg"
      >
        {btnLoading ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
