// src/pages/dashboards/FleetManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/fleet/Header";
import StatsCards from "../../components/fleet/StatsCards";
import LiveMap from "../../components/fleet/LiveMap";
import VehicleCard from "../../components/fleet/VehicleCard";
import AddVehicleModal from "../../components/fleet/AddVehicleModal";
import { useNavigate } from "react-router-dom"; // ← Add this at top

export default function FleetManagerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
const navigate = useNavigate();

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 8000);
    return () => clearInterval(interval);
  }, []);

  const simulate = (id) => {
    axios.patch(`http://localhost:8080/api/vehicles/${id}/telemetry`, {
      latitude: 19.0760 + (Math.random() - 0.5) * 0.2,
      longitude: 72.8777 + (Math.random() - 0.5) * 0.2,
      speed: Math.floor(Math.random() * 130),
      fuelLevel: Math.round(15 + Math.random() * 75),
    }).then(fetchVehicles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-6">
  {/* Add Vehicle Button */}
  <button
    onClick={() => setShowAddModal(true)}
    className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition duration-300"
  >
    + Add New Vehicle
  </button>

  {/* Main Action Buttons */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
    <a
      href="/dashboard/manager/pending-bookings"
      className="px-12 py-8 bg-gradient-to-r from-orange-500 to-red-600 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition transform text-center"
    >
      Pending Customer Bookings
    </a>

    <a
      href="/dashboard/ai-optimizer"
      className="px-12 py-8 bg-gradient-to-r from-indigo-600 to-purple-700 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-105 transition transform text-center"
    >
      Run AI Route Optimizer
    </a>
  </div>

  {/* NEW: Plan Management Buttons — YOUR REQUEST */}
  <div className="text-center space-x-8 mt-16">
    <button
      onClick={() => window.location.href = "/dashboard/ai-optimizer"}
      className="px-14 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition transform"
    >
      CREATE NEW PLAN
    </button>

    <button
  onClick={() => navigate("/dashboard/route-plans")}
  className="px-16 py-7 bg-gradient-to-r from-purple-700 to-pink-700 text-white text-4xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition transform border-4 border-white"
>
  VIEW ALL PLANS & ASSIGN DRIVERS
</button>
  </div>

  {/* Optional: Extra style divider */}
  <div className="mt-20 mb-10 border-t-4 border-purple-300 opacity-50"></div>
</div>

      <main className="max-w-7xl mx-auto px-6 pb-10">
        <StatsCards vehicles={vehicles} />
        <LiveMap vehicles={vehicles} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {vehicles.map(v => (
            <VehicleCard key={v.id} vehicle={v} onSimulate={simulate} />
          ))}
        </div>
      </main>

      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchVehicles}
      />
    </div>
  );
}
