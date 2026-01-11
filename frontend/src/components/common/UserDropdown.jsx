import React, { useEffect, useRef, useState } from "react";
import { UserData } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { server } from "../../utils/config";

const UserDropdown = () => {
  const { user, logoutUser } = UserData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  const goToProfile = () => {
    setOpen(false);
    navigate("/account/profile");
  };

  const handleLogout = () => {
    logoutUser();
    setOpen(false);
    navigate("/");
  };

  return (
    <div className="relative text-gray-700" ref={ref}>
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
      >
        <img
          src={user?.avatar ? `${server}${user.avatar}` : "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=10b981&color=fff&size=128"}
          alt="avatar"
          className="w-9 h-9 rounded-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.name || "User") + "&background=10b981&color=fff&size=128";
          }}
        />
        <div className="hidden sm:block text-left">
          <div className="text-sm font-semibold">{user?.name || "Guest"}</div>
          <div className="text-xs text-gray-500">{(user?.role || "Visitor").toUpperCase()}</div>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50">
          <div>
            <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">{user?.name || "Guest User"}</span>
            <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">{user?.email || "no-reply@example.com"}</span>
          </div>

          <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
            <li>
              <button onClick={() => { setOpen(false); navigate('/account/profile'); }} className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">
                <svg className="fill-gray-500 group-hover:fill-gray-700 dark:fill-gray-400 dark:group-hover:fill-gray-300" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 14.1526 4.3002 16.1184 5.61936 17.616C6.17279 15.3096 8.24852 13.5955 10.7246 13.5955H13.2746C15.7509 13.5955 17.8268 15.31 18.38 17.6167C19.6996 16.119 20.5 14.153 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5ZM17.0246 18.8566V18.8455C17.0246 16.7744 15.3457 15.0955 13.2746 15.0955H10.7246C8.65354 15.0955 6.97461 16.7744 6.97461 18.8455V18.856C8.38223 19.8895 10.1198 20.5 12 20.5C13.8798 20.5 15.6171 19.8898 17.0246 18.8566ZM2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9991 7.25C10.8847 7.25 9.98126 8.15342 9.98126 9.26784C9.98126 10.3823 10.8847 11.2857 11.9991 11.2857C13.1135 11.2857 14.0169 10.3823 14.0169 9.26784C14.0169 8.15342 13.1135 7.25 11.9991 7.25ZM8.48126 9.26784C8.48126 7.32499 10.0563 5.75 11.9991 5.75C13.9419 5.75 15.5169 7.32499 15.5169 9.26784C15.5169 11.2107 13.9419 12.7857 11.9991 12.7857C10.0563 12.7857 8.48126 11.2107 8.48126 9.26784Z" fill="" /></svg>
                Edit profile
              </button>
            </li>
          </ul>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">Sign out</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
