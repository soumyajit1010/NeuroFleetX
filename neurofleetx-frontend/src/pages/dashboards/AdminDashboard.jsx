import React from "react";

const AdminDashboard = () => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {userEmail || "Admin"}!</p>
      {/* Add admin-specific features, e.g., vehicle management */}
    </div>
  );
};

export default AdminDashboard;