import { UserData } from "../../context/UserContext";
import { server } from "../../utils/config";
import toast from "react-hot-toast";

export default function UserMetaCard() {
  const { user, updateAvatar } = UserData();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Allow ONLY images
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed for avatar");
      e.target.value = "";
      return;
    }

    // Max size: 2MB
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("Image size must be less than 2MB");
      e.target.value = "";
      return;
    }

    await updateAvatar(file);

    // Reset input (important for re-uploading same image)
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-6 rounded-xl border p-5">
      <img
        src={
          user?.avatar
            ? user.avatar.startsWith("http")
              ? user.avatar
              : `${server}${user.avatar}`
            : "/avatar-placeholder.svg"
        }
        alt="User Avatar"
        className="h-24 w-24 rounded-full object-cover border"
      />

      <div className="flex-1">
        <h4 className="text-lg font-bold">{user?.name}</h4>
        <p className="text-sm text-gray-500">{user?.role}</p>

        <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
          {user?.status}
        </span>

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="mt-3 block text-sm"
        />
      </div>
    </div>
  );
}
