import React from "react";

const Header = ({ userRole, userEmail, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          {userRole} Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">{userEmail}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;