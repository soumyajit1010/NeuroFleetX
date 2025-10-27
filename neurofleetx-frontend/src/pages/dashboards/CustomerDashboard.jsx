import React from "react";

const CustomerDashboard = () => {
  const userEmail = localStorage.getItem("userEmail");

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
      <p>Welcome, {userEmail || "Customer"}!</p>
      {/* Add customer-specific features, e.g., booking vehicles */}
    </div>
  );
};

export default CustomerDashboard;