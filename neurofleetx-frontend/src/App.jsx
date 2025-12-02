// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import CustomerDashboard from "./pages/dashboards/CustomerDashboard";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import FleetManagerDashboard from "./pages/dashboards/FleetManagerDashboard";
import DriverDashboard from "./pages/dashboards/DriverDashboard";

// AI & Route Management
import AIRouteOptimizer from "./pages/dashboards/AIRouteOptimizer";
import RouteHistory from "./pages/dashboards/RouteHistory";
import RoutePlans from "./pages/dashboards/RoutePlans";           // NEW: View All Plans

// Maintenance
import VehicleHealthDashboard from "./pages/maintenance/VehicleHealthDashboard";
import VehicleHealthDetail from "./pages/maintenance/VehicleHealthDetail";
import AddMaintenanceLog from "./pages/maintenance/AddMaintenanceLog";

// Customer
import CreateBooking from "./pages/customer/CreateBooking";
import MyBookings from "./pages/customer/MyBookings";
import SmartRecommendations from "./pages/customer/SmartRecommendations";
import TrackDelivery from "./pages/customer/TrackDelivery";

// Fleet Manager
import PendingBookings from "./pages/dashboards/PendingBookings";

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* === AUTH === */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* === MAIN DASHBOARDS === */}
          <Route path="/dashboard/customer" element={<CustomerDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/fleetmanager" element={<FleetManagerDashboard />} />
          <Route path="/dashboard/driver" element={<DriverDashboard />} />

          {/* === AI ROUTE OPTIMIZER & PLANS === */}
          <Route path="/dashboard/ai-optimizer" element={<AIRouteOptimizer />} />
          <Route path="/dashboard/route-history" element={<RouteHistory />} />
          <Route path="/dashboard/route-plans" element={<RoutePlans />} />  {/* THIS WORKS! */}

          {/* === PREDICTIVE MAINTENANCE === */}
          <Route path="/dashboard/maintenance" element={<VehicleHealthDashboard />} />
          <Route path="/dashboard/health/:id" element={<VehicleHealthDetail />} />
          <Route path="/dashboard/maintenance/add/:id" element={<AddMaintenanceLog />} />

          {/* CUSTOMER DASHBOARD PAGES */}
<Route path="/dashboard/customer/book" element={<CreateBooking />} />
<Route path="/dashboard/customer/bookings" element={<MyBookings />} />
<Route path="/dashboard/customer/recommendations" element={<SmartRecommendations />} />
<Route path="/dashboard/customer/track" element={<TrackDelivery />} />

          {/* === FLEET MANAGER TOOLS === */}
          <Route path="/dashboard/manager/pending-bookings" element={<PendingBookings />} />

          {/* === 404 FALLBACK === */}
          <Route
            path="*"
            element={
              <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <div className="text-center p-16 bg-white rounded-3xl shadow-2xl">
                  <h1 className="text-8xl font-bold text-purple-600 mb-6">404</h1>
                  <p className="text-3xl text-gray-700 mb-8">Page Not Found</p>
                  <a
                    href="/"
                    className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-3xl shadow-xl hover:scale-110 transition"
                  >
                    ← Back to Login
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}