// src/pages/dashboards/FleetManagerDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const FleetManagerDashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    manufacturingYear: "",
    vin: "",
  });

  // Fetch vehicles every 8 seconds
  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/vehicles");
      setVehicles(res.data);
    } catch (err) {
      console.error("Failed to fetch vehicles:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 8000);
    return () => clearInterval(interval);
  }, []);

  // Add new vehicle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/vehicles", {
        licensePlate: formData.licensePlate.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        manufacturingYear: parseInt(formData.manufacturingYear),
        vin: formData.vin.trim(),
      });

      setShowAddForm(false);
      setFormData({ licensePlate: "", make: "", model: "", manufacturingYear: "", vin: "" });
      fetchVehicles();
      alert("Vehicle added successfully!");
    } catch (err) {
      alert("Failed to add vehicle: " + (err.response?.data?.message || err.message));
    }
  };

  // Simulate live telemetry (for testing — click this!)
  const simulateTelemetry = async (vehicleId) => {
    try {
      await axios.patch(`http://localhost:8080/api/vehicles/${vehicleId}/telemetry`, {
        latitude: 19.0760 + (Math.random() - 0.5) * 0.2,
        longitude: 72.8777 + (Math.random() - 0.5) * 0.2,
        speed: Math.floor(Math.random() * 130),
        fuelLevel: Math.round(15 + Math.random() * 75),
      });
      fetchVehicles();
    } catch (err) {
      console.error("Telemetry update failed", err);
    }
  };

  const activeCount = vehicles.filter((v) => v.status === "IN_USE").length;
  const totalCount = vehicles.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Fleet Operations Center</h1>
              <p className="text-slate-600 mt-1">Real-time vehicle tracking and management</p>
            </div>
            <div className="flex gap-4 items-center">
              <button
                onClick={() => simulateTelemetry(1)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
              >
                Simulate Live Telemetry
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium">Total Vehicles</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{totalCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium">On Road</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium">Available</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalCount - activeCount}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <p className="text-slate-600 text-sm font-medium">Last Update</p>
            <p className="text-lg font-semibold text-slate-900 mt-2">
              {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>

        {/* Live Map */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>
              Live Vehicle Tracking
            </h2>
            <p className="text-indigo-100">Real-time location and telemetry</p>
          </div>
          <div style={{ height: "560px" }}>
            <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {vehicles
                .filter((v) => v.latitude && v.longitude)
                .map((vehicle) => (
                  <Marker
                    key={vehicle.id}
                    position={[vehicle.latitude, vehicle.longitude]}
                    icon={L.divIcon({
                      className: "custom-marker",
                      html: `<div class="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
                        ${vehicle.licensePlate.slice(-4)}
                      </div>`,
                      iconSize: [40, 40],
                      iconAnchor: [20, 40],
                    })}
                  >
                    <Popup>
                      <div className="text-center p-2">
                        <h3 className="font-bold text-indigo-700 text-lg">{vehicle.licensePlate}</h3>
                        <p className="text-sm font-medium">{vehicle.make} {vehicle.model}</p>
                        <hr className="my-2" />
                        <p><strong>Speed:</strong> {(vehicle.speed || 0).toFixed(0)} km/h</p>
                        <p><strong>Fuel:</strong> {vehicle.fuelLevel ? `${vehicle.fuelLevel.toFixed(0)}%` : "N/A"}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {vehicle.lastUpdated ? new Date(vehicle.lastUpdated).toLocaleString() : "No data"}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 transition-all hover:shadow-2xl ${
                  vehicle.status === "IN_USE" ? "border-green-500" : "border-gray-300"
                }`}
              >
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4">
                  <h3 className="text-lg font-bold">{vehicle.licensePlate}</h3>
                  <p className="text-sm opacity-90">
                    {vehicle.make} {vehicle.model} • {vehicle.manufacturingYear}
                  </p>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-center mb-4">
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${
                        vehicle.status === "IN_USE"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {vehicle.status || "AVAILABLE"}
                    </span>
                    <span className="text-2xl font-bold text-indigo-600">
                      {(vehicle.speed || 0).toFixed(0)} km/h
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><strong>Fuel:</strong> {vehicle.fuelLevel ? `${vehicle.fuelLevel.toFixed(0)}%` : "N/A"}</p>
                    <p><strong>VIN:</strong> {vehicle.vin}</p>
                    <p className="text-xs text-gray-500">
                      Last seen: {vehicle.lastUpdated ? new Date(vehicle.lastUpdated).toLocaleTimeString() : "Never"}
                    </p>
                  </div>
                  <button
                    onClick={() => simulateTelemetry(vehicle.id)}
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium transition"
                  >
                    Send Fake GPS Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Add New Vehicle</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { key: "licensePlate", label: "License Plate", placeholder: "MH-04-AB-1234" },
                { key: "make", label: "Make", placeholder: "Tata" },
                { key: "model", label: "Model", placeholder: "Nexon" },
                { key: "manufacturingYear", label: "Year", type: "number", placeholder: "2025" },
                { key: "vin", label: "VIN", placeholder: "ABC12345678901234" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition"
                    placeholder={field.placeholder}
                    required
                  />
                </div>
              ))}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition"
                >
                  Add Vehicle
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-4 rounded-xl font-bold text-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagerDashboard;