import React, { useEffect, useState } from "react";

const ThemeToggleButton = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    // Default to light theme instead of system preference
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const onToggle = () => setDark((d) => !d);

  return (
    <button
      onClick={onToggle}
      aria-pressed={dark}
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      aria-label="Toggle theme"
      title={dark ? "Switch to light" : "Switch to dark"}
    >
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/></svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8L6.76 4.84zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9v-2h-3v2h3zM17.24 4.84l1.79-1.79 1.79 1.79-1.79 1.8-1.79-1.8zM12 6a6 6 0 100 12A6 6 0 0012 6z" fill="currentColor"/></svg>
      )}
    </button>
  );
};

export default ThemeToggleButton;
