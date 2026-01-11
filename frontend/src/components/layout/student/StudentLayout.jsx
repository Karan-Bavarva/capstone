import React from "react";
import AppLayout from "../common/AppLayout";

export default function StudentLayout({ children }) {
  return <AppLayout title="Student Dashboard">{children}</AppLayout>;
}
