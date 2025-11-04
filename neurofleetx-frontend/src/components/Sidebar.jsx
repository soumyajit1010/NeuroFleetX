import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/", icon: "Home" },
    { name: "Vehicles", path: "/vehicles", icon: "Car" },
    { name: "Bookings", path: "/bookings", icon: "Calendar" },
    { name: "Users", path: "/users", icon: "Users" },
    { name: "Reports", path: "/reports", icon: "Chart" },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-indigo-600">FleetFlow</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition ${
              location.pathname === item.path
                ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600"
                : ""
            }`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;