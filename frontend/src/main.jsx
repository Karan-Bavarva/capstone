import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { UserContextProvider } from "./context/UserContext.jsx";
import { CourseContextProvider } from "./context/CourseContext.jsx";

const root = createRoot(document.getElementById("root"));

root.render(
  <UserContextProvider>
    <CourseContextProvider>
      <App />
    </CourseContextProvider>
  </UserContextProvider>
);
