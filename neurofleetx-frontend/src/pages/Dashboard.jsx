import React from "react";
import { useParams } from "react-router-dom";

const Dashboard = () => {
  const { role } = useParams();

  const roleDisplay = {
    Admin: "Administrator",
    FleetManager: "Fleet Manager",
    Driver: "Driver",
    Customer: "Customer",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-2xl w-full text-center border border-gray-200">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap=" ḅround" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {roleDisplay[role] || role} Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome back! Manage your fleet, bookings, and users from here.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold">Bookings</h3>
            <p className="text-3xl font-extrabold mt-2">24</p>
            <p className="text-sm opacity-90">Active today</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold">Fleet</h3>
            <p className="text-3xl font-extrabold mt-2">18</p>
            <p className="text-sm opacity-90">Vehicles online</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-xl shadow-md transform hover:scale-105 transition-transform duration-200">
            <h3 className="text-xl font-bold">Users</h3>
            <p className="text-3xl font-extrabold mt-2">142</p>
            <p className="text-sm opacity-90">Total registered</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-10">
          Add more widgets, charts, or navigation here.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;