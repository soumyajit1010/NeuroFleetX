import React from "react";

const FleetManagerDashboard = () => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Fleet Manager Dashboard</h1>
      <p>Welcome, {userEmail || "Fleet Manager"}!</p>
      {/* Add fleet manager-specific features, e.g., vehicle management */}
    </div>
  );
};

export default FleetManagerDashboard;