import React from "react";

const DriverDashboard = () => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Driver Dashboard</h1>
      <p>Welcome, {userEmail || "Driver"}!</p>
      {/* Add driver-specific features, e.g., assigned trips */}
    </div>
  );
};

export default DriverDashboard;