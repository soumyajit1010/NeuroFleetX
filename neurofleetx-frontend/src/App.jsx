import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import FleetManagerDashboard from "./pages/dashboards/FleetManagerDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard/customer" element={<CustomerDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/fleetmanager" element={<FleetManagerDashboard />} />
        <Route path="/dashboard/driver" element={<DriverDashboard />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;