import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/public/home/Home.jsx";
import Courses from "./pages/public/courses/Courses.jsx";
import Login from "./pages/public/auth/Login.jsx";
import Register from "./pages/public/auth/Register.jsx";
import ForgotPassword from "./pages/public/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/public/auth/ResetPassword.jsx";
import CourseDetails from "./pages/public/courseetailsview/CourseDetailsView.jsx";

// DASHBOARDS
import AdminDashboard from "./pages/admin/dashbord/Dashbord.jsx";
import TutorDashboard from "./pages/tutor/dashbord/Dashbord.jsx";
import StudentDashboard from "./pages/student/Dashbord/dashbord.jsx";

import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

// LAYOUTS
import AdminLayout from "./components/layout/admin/AdminLayout.jsx";
import TutorLayout from "./components/layout/tutor/TutorLayout.jsx";
import StudentLayout from "./components/layout/student/StudentLayout.jsx";
import DynamicProfileLayout from "./components/layout/common/DynamicProfileLayout.jsx";

// ADMIN
import AdminUsers from "./pages/admin/users/AdminUsers.jsx";
import { AdminUserProvider } from "./context/AdminUserContext.jsx";
import AdminCourseList from "./pages/admin/Courses/AdminCourseList.jsx";
import AdminCourseView from "./pages/admin/Courses/AdminCourseView.jsx";
import AdminEditCourse from "./pages/admin/Courses/AdminEditCourse.jsx";
import AdminCourseInsights from "./pages/admin/Courses/AdminCourseInsights.jsx";
import AdminUserDetails from "./pages/admin/users/AdminUserDetails.jsx";
import AddSubAdmin from "./pages/admin/users/AddSubAdmin.jsx";
import StudentCertificates from "./pages/student/certificates";

// TUTOR COURSES
import MyCourses from "./pages/tutor/my-courses/MyCourses.jsx";
import AddCourse from "./pages/tutor/my-courses/AddCourse.jsx";
import EditCourse from "./pages/tutor/my-courses/EditCourse.jsx";
import ViewCourse from "./pages/tutor/my-courses/ViewCourse.jsx";
import TutorCourseDetails from "./pages/tutor/my-courses/CourseDetails.jsx";
import StudentMyCourses from "./pages/student/my-courses/StudentMyCourses.jsx";
import StudentCourseDetails from "./pages/student/my-courses/StudentCourseDetails.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ADMIN */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminUserProvider>
                  <AdminUsers />
                </AdminUserProvider>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/add-sub-admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminUserProvider>
                  <AddSubAdmin />
                </AdminUserProvider>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminUserProvider>
                  <AdminUserDetails />
                </AdminUserProvider>
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminCourseList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/view/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminCourseView />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminEditCourse />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/courses/insights/:id"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminLayout>
                <AdminCourseInsights />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* TUTOR */}
        <Route
          path="/tutor/dashboard"
          element={
            <ProtectedRoute allowedRoles={["TUTOR"]}>
              <TutorLayout>
                <TutorDashboard />
              </TutorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/my-courses"
          element={
            <ProtectedRoute allowedRoles={["TUTOR"]}>
              <TutorLayout>
                <MyCourses />
              </TutorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/my-courses/add"
          element={
            <ProtectedRoute allowedRoles={["TUTOR"]}>
              <TutorLayout>
                <AddCourse />
              </TutorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/my-courses/edit/:id"
          element={
            <ProtectedRoute allowedRoles={["TUTOR"]}>
              <TutorLayout>
                <EditCourse />
              </TutorLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/tutor/my-courses/view/:id"
          element={
            <ProtectedRoute allowedRoles={["TUTOR"]}>
              <TutorLayout>
                  <ViewCourse />
              </TutorLayout>
            </ProtectedRoute>
          }
        />

          <Route
            path="/tutor/my-courses/details/:id"
            element={
              <ProtectedRoute allowedRoles={["TUTOR","ADMIN"]}>
                <TutorLayout>
                  <TutorCourseDetails />
                </TutorLayout>
              </ProtectedRoute>
            }
          />

        {/* STUDENT */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout>
                <StudentDashboard />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "TUTOR", "STUDENT"]}>
              <DynamicProfileLayout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout>
                <StudentMyCourses />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/student/my-courses/:id"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout>
                <StudentCourseDetails />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

         <Route
          path="/student/certificates"
          element={
            <ProtectedRoute allowedRoles={["STUDENT"]}>
              <StudentLayout>
                <StudentCertificates />
              </StudentLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
