// src/pages/dashboards/FleetManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/fleet/Header";
import StatsCards from "../../components/fleet/StatsCards";
import LiveMap from "../../components/fleet/LiveMap";
import VehicleCard from "../../components/fleet/VehicleCard";
import AddVehicleModal from "../../components/fleet/AddVehicleModal";

export default function FleetManagerDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

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
      
      {/* Add "Add Vehicle" button here */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
        >
          + Add New Vehicle
        </button>
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