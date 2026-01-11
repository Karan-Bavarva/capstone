const staticAdminData = {
  metrics: {
    totalUsers: 148,
    pendingApprovals: 5,
    totalCourses: 32,
    activeTutors: 22,
  },
  users: [
    { id: "u1", name: "Alice Johnson", email: "alice@example.com", role: "STUDENT", status: "ACTIVE" },
    { id: "u2", name: "Bob Martin", email: "bob@example.com", role: "TUTOR", status: "PENDING" },
    { id: "u3", name: "Carol Lee", email: "carol@example.com", role: "STUDENT", status: "ACTIVE" },
    { id: "u4", name: "David Kim", email: "david@example.com", role: "TUTOR", status: "REJECTED" },
    { id: "u5", name: "Eva Green", email: "eva@example.com", role: "STUDENT", status: "PENDING" },
  ],
};

export default staticAdminData;
