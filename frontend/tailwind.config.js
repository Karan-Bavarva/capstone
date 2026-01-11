import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", ...defaultTheme.fontFamily.sans],
      },

      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },

      fontSize: {
        "theme-xl": ["20px", "30px"],
        "theme-sm": ["14px", "20px"],
        "theme-xs": ["12px", "18px"],
      },

      colors: {
        brand: {
          25: "#F2F7FF",
          50: "#ECF3FF",
          100: "#DDE9FF",
          200: "#C2D6FF",
          300: "#9CB9FF",
          400: "#7592FF",
          500: "#465FFF",
          600: "#3641F5",
          700: "#2A31D8",
          800: "#252DAE",
          900: "#262E89",
          950: "#161950",
        },
      },

      boxShadow: {
        "theme-md":
          "0px 4px 8px -2px rgba(16, 24, 40, 0.10), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
        "theme-lg":
          "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
        "theme-sm":
          "0px 1px 3px 0px rgba(16, 24, 40, 0.10), 0px 1px 2px 0px rgba(16, 24, 40, 0.06)",
        "theme-xs":
          "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        "theme-xl":
          "0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)",
      },

      zIndex: {
        1: "1",
        9: "9",
        99: "99",
        999: "999",
        9999: "9999",
        99999: "99999",
        999999: "999999",
      },
    },
  },

  plugins: [forms],
};
