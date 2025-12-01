import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import FleetManagerDashboard from "./pages/dashboards/FleetManagerDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";

import AIRouteOptimizer from "./pages/dashboards/AIRouteOptimizer";
import RouteHistory from "./pages/dashboards/RouteHistory";

import VehicleHealthDashboard from "./pages/maintenance/VehicleHealthDashboard";
import VehicleHealthDetail from "./pages/maintenance/VehicleHealthDetail";
import AddMaintenanceLog from "./pages/maintenance/AddMaintenanceLog";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboards */}
          <Route path="/dashboard/fleetmanager" element={<FleetManagerDashboard />} />
          <Route path="/dashboard/driver" element={<DriverDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />

          {/* AI Route Optimizer */}
          <Route path="/dashboard/ai-optimizer" element={<AIRouteOptimizer />} />
          <Route path="/dashboard/route-history" element={<RouteHistory />} />

          {/* Predictive Maintenance Module — NEW ROUTES */}
          <Route path="/dashboard/maintenance" element={<VehicleHealthDashboard />} />
          <Route path="/dashboard/health/:id" element={<VehicleHealthDetail />} />
          <Route path="/dashboard/maintenance/add/:id" element={<AddMaintenanceLog />} />

          {/* 404 fallback */}
          <Route
            path="*"
            element={
              <div style={{ padding: 100, textAlign: "center", fontSize: 30 }}>
                404 - Page Not Found <br />
                <a href="/">← Back to Login</a>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
