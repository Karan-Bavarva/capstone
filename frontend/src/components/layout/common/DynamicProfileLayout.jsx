import React from "react";
import { UserData } from "../../../context/UserContext";

import AdminLayout from "../admin/AdminLayout";
import TutorLayout from "../tutor/TutorLayout";
import StudentLayout from "../student/StudentLayout";
import Profile from "../../../pages/common/Profile";

export default function DynamicProfileLayout() {
  const { user } = UserData();

  if (!user) return null;

  if (user.role === "ADMIN") {
    return (
      <AdminLayout>
        <Profile />
      </AdminLayout>
    );
  }

  if (user.role === "TUTOR") {
    return (
      <TutorLayout>
        <Profile />
      </TutorLayout>
    );
  }

  return (
    <StudentLayout>
      <Profile />
    </StudentLayout>
  );
}
