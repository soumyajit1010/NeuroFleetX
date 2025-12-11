// src/pages/dashboards/FleetManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/fleet/Header";
import StatsCards from "../../components/fleet/StatsCards";
import LiveMap from "../../components/fleet/LiveMap";
import VehicleCard from "../../components/fleet/VehicleCard";
import AddVehicleModal from "../../components/fleet/AddVehicleModal";
import { useNavigate } from "react-router-dom";

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
    axios
      .patch(`http://localhost:8080/api/vehicles/${id}/telemetry`, {
        latitude: 19.0760 + (Math.random() - 0.5) * 0.2,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.2,
        speed: Math.floor(Math.random() * 130),
        fuelLevel: Math.round(15 + Math.random() * 75),
      })
      .then(fetchVehicles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <Header />

      {/* Hero Section with Actions */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-cyan-600/20"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Add Vehicle Button - Floating Style */}
          <div className="flex justify-center mb-12">
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg rounded-full shadow-2xl hover:shadow-violet-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10">+ Add New Vehicle</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </button>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <a
              href="/dashboard/manager/pending-bookings"
              className="group relative block p-10 bg-gradient-to-br from-orange-500/90 to-red-600/90 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl font-extrabold tracking-tight">
                Pending Customer Bookings
              </div>
              <div className="mt-2 text-orange-100">Review & approve new ride requests</div>
              <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </a>

            <a
              href="/dashboard/ai-optimizer"
              className="group relative block p-10 bg-gradient-to-br from-cyan-500/90 to-blue-600/90 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl hover:shadow-cyan-500/50 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="text-3xl font-extrabold tracking-tight">
                Run AI Route Optimizer
              </div>
              <div className="mt-2 text-cyan-100">Optimize routes with smart algorithms</div>
              <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </a>
          </div>

          {/* Plan Management Section - Premium Feel */}
          <div className="text-center py-16">
            <h2 className="text-5xl font-black mb-12 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              Fleet Route Planning
            </h2>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button
                onClick={() => navigate("/dashboard/ai-optimizer")}
                className="group relative px-14 py-7 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/60 transform hover:scale-105 transition-all duration-300 border-2 border-emerald-400/50"
              >
                <span className="relative z-10 drop-shadow-lg">CREATE NEW PLAN</span>
                <div className="absolute inset-0 rounded-3xl bg-white/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
              </button>

              <button
                onClick={() => navigate("/dashboard/route-plans")}
                className="group relative px-16 py-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white text-3xl font-extrabold rounded-3xl shadow-2xl hover:shadow-pink-500/60 transform hover:scale-105 transition-all duration-300 ring-4 ring-pink-400/50 ring-offset-4 ring-offset-transparent"
              >
                <span className="relative z-10 drop-shadow-2xl">VIEW ALL PLANS & ASSIGN DRIVERS</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Decorative Divider */}
          <div className="max-w-4xl mx-auto mt-20 mb-10 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-60"></div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 pb-20 -mt-10">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <StatsCards vehicles={vehicles} />
        </div>

        <div className="mt-10 backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <LiveMap vehicles={vehicles} />
        </div>

        {/* Vehicle Grid */}
        <div className="mt-10">
          <h3 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Live Vehicle Fleet
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <VehicleCard vehicle={v} onSimulate={simulate} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      <AddVehicleModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchVehicles}
      />
    </div>
  );
}