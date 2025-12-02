// src/pages/dashboards/AIRouteOptimizer.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEPOT = { lat: 19.0760, lng: 72.8777 };

export default function AIRouteOptimizer() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxVehicles, setMaxVehicles] = useState(3);
  const [vehicleCountAvailable, setVehicleCountAvailable] = useState(0);

  // Load data function
  const loadData = async () => {
    try {
      const [vehRes, jobRes] = await Promise.all([
        axios.get("http://localhost:8080/api/vehicles"),
        axios.get("http://localhost:8080/api/bookings/pending-jobs")
      ]);

      const vehicles = Array.isArray(vehRes.data) ? vehRes.data : [];
      setVehicleCountAvailable(vehicles.length);
      if (vehicles.length > 0) {
        setMaxVehicles(prev => Math.min(prev || 3, vehicles.length));
      }

      const validJobs = (Array.isArray(jobRes.data) ? jobRes.data : [])
        .filter(j => j && j.latitude && j.longitude);
      setJobs(validJobs);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalLoadKg = jobs.reduce((sum, j) => sum + (j.weightKg || 0), 0).toFixed(1);

  const runAIOptimizer = async () => {
    if (jobs.length === 0) {
      alert("No pending jobs to optimize!");
      return;
    }

    const minimalJobs = jobs.map(job => ({
      id: job.id,
      latitude: job.latitude,
      longitude: job.longitude,
      pickupLatitude: job.pickupLatitude || DEPOT.lat,
      pickupLongitude: job.pickupLongitude || DEPOT.lng,
      weightKg: job.weightKg || 10.0
    }));

    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/optimize?maxVehicles=${maxVehicles}`,
        minimalJobs,
        {
          headers: { "Content-Type": "application/json" },
          timeout: 30000
        }
      );
      setPlan(res.data);
      alert(`PLAN #${res.data.id} CREATED SUCCESSFULLY!\n${res.data.numberOfVehicles} vehicles • ${res.data.totalDistanceKm?.toFixed(1)} km`);
    } catch (err) {
      console.error("Optimizer error:", err.response || err);
      alert("ERROR: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const resetAndNewPlan = () => {
    setPlan(null);
    loadData();
    alert("Ready for a new optimization run!");
  };

  const colors = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#f43f5e"];

  const getRoutePolyline = (vehicleId) => {
    if (!plan?.jobs) return [];
    const routeJobs = plan.jobs
      .filter(j => j.assignedVehicleId === vehicleId)
      .sort((a, b) => (a.sequenceInRoute || 0) - (b.sequenceInRoute || 0));
    const points = [[DEPOT.lat, DEPOT.lng]];
    routeJobs.forEach(j => points.push([j.latitude, j.longitude]));
    points.push([DEPOT.lat, DEPOT.lng]);
    return points;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          NeuroFleetX AI Engine
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-10">
          {/* Stats + Buttons */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-8">
            <div>
              <h2 className="text-4xl font-bold text-purple-700">Today's Jobs: {jobs.length}</h2>
              <p className="text-2xl text-gray-600 mt-2">Total Load: {totalLoadKg} kg</p>
              <p className="text-lg text-gray-500">Available Vehicles: {vehicleCountAvailable}</p>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <label className="block text-xl font-bold mb-2 text-purple-700">Max Vehicles</label>
                <input
                  type="number"
                  min="1"
                  max={vehicleCountAvailable || 10}
                  value={maxVehicles}
                  onChange={(e) => setMaxVehicles(Math.max(1, Math.min(vehicleCountAvailable, Number(e.target.value))))}
                  disabled={loading}
                  className="w-28 px-4 py-3 text-2xl text-center border-4 border-purple-400 rounded-2xl font-bold focus:outline-none focus:border-purple-600"
                />
              </div>

              {!plan ? (
                <button
                  onClick={runAIOptimizer}
                  disabled={loading || jobs.length === 0}
                  className={`px-16 py-6 text-3xl font-bold text-white rounded-3xl shadow-2xl transition-all transform hover:scale-105 ${
                    loading || jobs.length === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  }`}
                >
                  {loading ? "AI THINKING..." : "RUN AI OPTIMIZER"}
                </button>
              ) : (
                <button
                  onClick={resetAndNewPlan}
                  className="px-16 py-6 text-3xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl shadow-2xl hover:scale-105 transition transform"
                >
                  CREATE NEW PLAN
                </button>
              )}
            </div>
          </div>

          {/* Pending Jobs List */}
          {jobs.length > 0 && !plan && (
            <div className="mb-12 bg-gradient-to-r from-purple-50 to-pink-50 p-8 rounded-3xl border-4 border-purple-200">
              <h2 className="text-4xl font-bold text-purple-800 mb-8 text-center">Pending Delivery Jobs</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-purple-300 hover:scale-105 transition">
                    <p className="text-2xl font-bold text-purple-700">Job #{job.id}</p>
                    <p className="text-lg"><strong>Customer:</strong> {job.customerName || `Customer #${job.customerId}`}</p>
                    <p className="text-lg"><strong>Drop:</strong> {job.address}</p>
                    <p className="text-sm text-gray-600">({job.latitude?.toFixed(4)}, {job.longitude?.toFixed(4)})</p>
                    <p className="text-lg mt-3"><strong>Weight:</strong> {job.weightKg} kg</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan Result */}
          {plan && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-8 rounded-3xl text-center shadow-2xl">
                  <h3 className="text-6xl font-bold">{plan.numberOfVehicles || 0}</h3>
                  <p className="text-2xl">Vehicles Used</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white p-8 rounded-3xl text-center shadow-2xl">
                  <h3 className="text-6xl font-bold">{(plan.totalDistanceKm || 0).toFixed(1)}</h3>
                  <p className="text-2xl">Total KM</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white p-8 rounded-3xl text-center shadow-2xl">
                  <h3 className="text-6xl font-bold">{plan.jobs?.length || 0}</h3>
                  <p className="text-2xl">Deliveries</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-600 text-white p-8 rounded-3xl text-center shadow-2xl">
                  <h3 className="text-6xl font-bold">100%</h3>
                  <p className="text-2xl">Optimized</p>
                </div>
              </div>

              <div className="h-screen rounded-3xl overflow-hidden shadow-2xl border-8 border-purple-300 mb-10">
                <MapContainer center={[DEPOT.lat, DEPOT.lng]} zoom={11} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[DEPOT.lat, DEPOT.lng]}>
                    <Popup>
                      <div className="font-bold text-lg">DEPOT</div>
                    </Popup>
                  </Marker>

                  {plan.jobs && [...new Set(plan.jobs.map(j => j.assignedVehicleId))].map((id, i) => (
                    <Polyline
                      key={id}
                      positions={getRoutePolyline(id)}
                      color={colors[i % colors.length]}
                      weight={8}
                      opacity={0.8}
                    />
                  ))}

                  {plan.jobs?.map((job, idx) => (
                    <Marker key={job.id} position={[job.latitude, job.longitude]}>
                      <Popup>
                        <div>
                          <strong>Stop #{job.sequenceInRoute}</strong><br />
                          Job #{job.id} • Vehicle {job.assignedVehicleId}<br />
                          {job.customerName || "Customer"} • {job.weightKg} kg
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="text-center space-x-8 mt-10">
  {plan && (
    <button
      onClick={resetAndNewPlan}
      className="px-12 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-2xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition"
    >
      CREATE NEW PLAN
    </button>
  )}

  <button
    onClick={() => navigate("/dashboard/route-plans")}
    className="px-16 py-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white text-3xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition"
  >
    VIEW ALL PLANS & ASSIGN DRIVERS
  </button>
</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}