import React from "react";
import AppLayout from "../common/AppLayout";

export default function AdminLayout({ children }) {
  return <AppLayout title="Admin Dashboard">{children}</AppLayout>;
}
