// src/pages/dashboards/AIRouteOptimizer.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEPOT = { lat: 19.0760, lng: 72.8777 };

export default function AIRouteOptimizer() {
  const navigate = useNavigate();

  const [jobs] = useState([
    { customerName: "Amit Sharma", phone: "9876543210", address: "Andheri East", latitude: 19.1155, longitude: 72.8728, weightKg: 320 },
    { customerName: "Priya Mehta", phone: "9123456789", address: "Bandra West", latitude: 19.0561, longitude: 72.8297, weightKg: 180 },
    { customerName: "Rahul Singh", phone: "9988776655", address: "Juhu Beach", latitude: 19.0999, longitude: 72.8258, weightKg: 450 },
    { customerName: "Neha Kapoor", phone: "9001122334", address: "Powai", latitude: 19.1185, longitude: 72.9070, weightKg: 210 },
    { customerName: "Vikram Rao", phone: "8899776655", address: "Goregaon", latitude: 19.1646, longitude: 72.8493, weightKg: 600 },
    { customerName: "Sonia Gupta", phone: "8899001122", address: "Malad West", latitude: 19.1800, longitude: 72.8350, weightKg: 290 },
    { customerName: "Arjun Patel", phone: "8877665544", address: "Kandivali", latitude: 19.2044, longitude: 72.8377, weightKg: 400 },
  ]);

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxVehicles, setMaxVehicles] = useState(3);
  const [vehicleCountAvailable, setVehicleCountAvailable] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:8080/api/vehicles")
      .then(res => {
        const list = res.data || [];
        setVehicleCountAvailable(list.length);
        setMaxVehicles(Math.min(3, Math.max(1, list.length || 3)));
      })
      .catch(err => console.warn("Vehicle load error", err));
  }, []);

  const totalLoadKg = jobs.reduce((a, j) => a + (Number(j.weightKg) || 0), 0);

  const runAIOptimizer = async () => {
    if (Number(maxVehicles) < 1) {
      alert("Max vehicles must be at least 1");
      return;
    }
    if (vehicleCountAvailable && Number(maxVehicles) > vehicleCountAvailable) {
      alert(`Max vehicles cannot exceed available vehicles (${vehicleCountAvailable})`);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `http://localhost:8080/api/optimize?maxVehicles=${Number(maxVehicles)}`,
        jobs
      );

      setPlan(res.data);

      alert(
        `PLAN #${res.data.id} CREATED! ${res.data.numberOfVehicles} vehicles • ${(
          res.data.totalDistanceKm ?? 0
        ).toFixed(1)} km`
      );

      // ❌ Don't auto navigate anymore
      // navigate("/dashboard/route-history");

    } catch (err) {
      alert("Backend error: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  const colors = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444"];

  const getRoutePolyline = (vehicleId) => {
    if (!plan?.jobs) return [];
    const jobsForVehicle = plan.jobs
      .filter(j => j.assignedVehicleId === vehicleId)
      .sort((a, b) => (a.sequenceInRoute || 0) - (b.sequenceInRoute || 0));

    return [
      [DEPOT.lat, DEPOT.lng],
      ...jobsForVehicle.map(j => [j.latitude, j.longitude]),
      [DEPOT.lat, DEPOT.lng],
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* TITLE */}
        <h1 className="text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          NeuroFleetX AI Engine
        </h1>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-2xl p-10">

          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div>
              <h2 className="text-4xl font-bold">Today's Jobs: {jobs.length}</h2>
              <p className="text-2xl text-gray-600">Total Load: {totalLoadKg} kg</p>
              <p className="text-sm text-gray-500 mt-2">
                Available vehicles: {vehicleCountAvailable || "—"}
              </p>
            </div>

            {/* Max Vehicles + Button */}
            <div className="flex items-center gap-8">
              <div className="text-center">
                <label className="block text-xl font-bold mb-2">Max Vehicles</label>
                <input
                  type="number"
                  min="1"
                  max={vehicleCountAvailable || 10}
                  value={maxVehicles}
                  onChange={(e) => setMaxVehicles(Number(e.target.value) || 1)}
                  className="w-28 px-4 py-3 text-2xl text-center border-4 border-purple-400 rounded-2xl"
                />
                <p className="text-xs text-gray-500 mt-1">Max allowed: {vehicleCountAvailable || "—"}</p>
              </div>

              <button
                onClick={runAIOptimizer}
                disabled={loading}
                className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl shadow-2xl hover:scale-105 transition disabled:opacity-50"
              >
                {loading ? "AI THINKING..." : "RUN AI OPTIMIZER"}
              </button>
            </div>
          </div>

          {/* PLAN RESULTS */}
          {plan && (
            <>
              {/* Stats Boxes */}
              <div className="grid grid-cols-4 gap-8 mb-12">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl text-center shadow-xl">
                  <h3 className="text-5xl font-bold">{plan.numberOfVehicles}</h3>
                  <p className="text-lg mt-2">Vehicles Used</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl text-center shadow-xl">
                  <h3 className="text-5xl font-bold">{(plan.totalDistanceKm ?? 0).toFixed(1)} km</h3>
                  <p className="text-lg mt-2">Total Distance</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-6 rounded-3xl text-center shadow-xl">
                  <h3 className="text-5xl font-bold">{plan.jobs?.length || 0}</h3>
                  <p className="text-lg mt-2">Deliveries</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-6 rounded-3xl text-center shadow-xl">
                  <h3 className="text-5xl font-bold">100%</h3>
                  <p className="text-lg mt-2">Optimized</p>
                </div>
              </div>

              {/* MAP PREVIEW */}
              <div style={{ height: "600px" }} className="rounded-3xl overflow-hidden shadow-2xl border-4 border-purple-200">
                <MapContainer center={[DEPOT.lat, DEPOT.lng]} zoom={11} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Marker
                    position={[DEPOT.lat, DEPOT.lng]}
                    icon={L.divIcon({
                      html: `<div style="background:#dc2626;color:white;padding:8px 14px;border-radius:999px;font-weight:bold;border:4px solid white;">DEPOT</div>`,
                      iconSize: [90, 34],
                    })}
                  />

                  {plan?.jobs?.length > 0 &&
                    [...new Set(plan.jobs.map(j => j.assignedVehicleId).filter(Boolean))].map((vid, i) => (
                      <Polyline
                        key={vid}
                        positions={getRoutePolyline(vid)}
                        color={colors[i % colors.length]}
                        weight={8}
                        opacity={0.9}
                      />
                    ))
                  }

                  {plan.jobs?.map((job) => (
                    <Marker key={job.id} position={[job.latitude, job.longitude]}>
                      <Popup>
                        <strong>{job.customerName}</strong>
                        <br />
                        Vehicle #{job.assignedVehicleId} • Stop #{job.sequenceInRoute}
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* VIEW ROUTE HISTORY BUTTON */}
              <div className="text-center mt-10">
                <button
                  onClick={() => navigate("/dashboard/route-history")}
                  className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-2xl font-bold rounded-3xl shadow-xl hover:scale-110 transition"
                >
                  View Route Plans History →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
