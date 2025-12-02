// src/pages/dashboards/RoutePlans.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

const DEPOT = { lat: 19.0760, lng: 72.8777 };

export default function RoutePlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/optimize/route-plans/all");
        let planList = Array.isArray(response.data) ? response.data : response.data?.plans || response.data?.data || [];
        const sorted = planList.filter(p => p && p.id).sort((a, b) => b.id - a.id);
        setPlans(sorted);
      } catch (err) {
        console.error("Failed to load plans:", err.response?.data || err.message);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const openAssignModal = async (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setAssignModalOpen(true);
    setSelectedDriver("");
    try {
      const dRes = await axios.get("http://localhost:8080/api/drivers");
      setDrivers(dRes.data || []);
    } catch (err) {
      console.error("Failed to load drivers:", err);
      setDrivers([]);
    }
  };

  const assignDriverToVehicle = async () => {
    if (!selectedDriver) {
      alert("Select a driver first");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/optimize/plans/${selectedPlan.id}/routes/${selectedVehicleId}/assign`,
        { driverId: Number(selectedDriver) }
      );
      alert("Driver assigned successfully!");
      setAssignModalOpen(false);
      // Refresh the selected plan
      const response = await axios.get("http://localhost:8080/api/optimize/route-plans/all");
      const updatedPlan = response.data.find(p => p.id === selectedPlan.id);
      setSelectedPlan(updatedPlan);
    } catch (err) {
      alert("Failed: " + (err.response?.data || err.message));
    }
  };

  const colors = ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#06b6d4"];

  const getRoutePolyline = (vehicleId) => {
    if (!selectedPlan?.jobs || !Array.isArray(selectedPlan.jobs)) return [];
    const route = selectedPlan.jobs
      .filter(j => j.assignedVehicleId === vehicleId)
      .sort((a, b) => (a.sequenceInRoute || 0) - (b.sequenceInRoute || 0));
    return [[DEPOT.lat, DEPOT.lng], ...route.map(j => [j.latitude || DEPOT.lat, j.longitude || DEPOT.lng]), [DEPOT.lat, DEPOT.lng]];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <p className="text-6xl font-extrabold text-purple-700">Loading 84+ Plans...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-8xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          All Route Plans ({plans.length})
        </h1>

        {!selectedPlan ? (
          <>
            {plans.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-5xl text-gray-600 mb-12">No plans found</p>
                <button
                  onClick={() => navigate("/dashboard/ai-optimizer")}
                  className="px-20 py-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-5xl font-bold rounded-3xl shadow-3xl hover:scale-110 transition transform"
                >
                  Run AI Optimizer Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="bg-white p-10 rounded-3xl shadow-3xl border-8 border-purple-300 cursor-pointer hover:scale-110 transition transform duration-300"
                  >
                    <h3 className="text-5xl font-extrabold text-purple-800 mb-6">Plan #{plan.id}</h3>
                    <div className="space-y-4 text-xl">
                      <p>Vehicles: <strong className="text-purple-700">{plan.numberOfVehicles || "?"}</strong></p>
                      <p>Distance: <strong className="text-pink-600">{(plan.totalDistanceKm || 0).toFixed(1)} km</strong></p>
                      <p>Jobs: <strong className="text-green-600">{plan.jobs?.length || 0}</strong></p>
                      <p className="text-sm text-gray-500 mt-8">
                        {plan.createdAt ? new Date(plan.createdAt).toLocaleString() : "Recently"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setSelectedPlan(null)}
              className="mb-12 px-10 py-5 bg-gradient-to-r from-gray-600 to-gray-800 text-white text-2xl font-bold rounded-2xl hover:scale-110 transition shadow-2xl"
            >
              ← Back to All Plans
            </button>

            <h2 className="text-7xl font-extrabold text-center mb-16 text-purple-700">
              PLAN #{selectedPlan.id} • {selectedPlan.jobs?.length || 0} Deliveries
            </h2>

            <div className="mb-16">
              <h3 className="text-4xl font-bold text-purple-800 mb-8">Vehicle Routes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...new Set(selectedPlan.jobs?.map(j => j.assignedVehicleId) || [])].map(vid => {
                  const routeJobs = selectedPlan.jobs.filter(j => j.assignedVehicleId === vid);
                  const driverId = routeJobs[0]?.assignedDriverId;
                  return (
                    <div key={vid} className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-purple-200">
                      <h4 className="text-2xl font-bold text-purple-700">Vehicle #{vid}</h4>
                      <p className="text-lg mt-2">Stops: {routeJobs.length}</p>
                      <p className="text-lg mt-2">Driver: {driverId ? `ID ${driverId}` : "Unassigned"}</p>
                      <button
                        onClick={() => openAssignModal(vid)}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-lg font-bold rounded-xl hover:scale-110 transition"
                      >
                        Assign Driver
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-screen rounded-3xl overflow-hidden shadow-3xl border-12 border-purple-400 mb-20">
              <MapContainer center={[DEPOT.lat, DEPOT.lng]} zoom={11} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[DEPOT.lat, DEPOT.lng]}>
                  <Popup><strong className="text-2xl">DEPOT (Mumbai)</strong></Popup>
                </Marker>
                {selectedPlan.jobs && [...new Set(selectedPlan.jobs.map(j => j.assignedVehicleId))].map((id, i) => (
                  <Polyline
                    key={id}
                    positions={getRoutePolyline(id)}
                    color={colors[i % colors.length]}
                    weight={12}
                    opacity={0.9}
                  />
                ))}
                {selectedPlan.jobs?.map(job => (
                  <Marker key={job.id} position={[job.latitude || DEPOT.lat, job.longitude || DEPOT.lng]}>
                    <Popup>
                      <div className="text-lg font-bold">Stop #{job.sequenceInRoute || "?"}</div>
                      <div>Job #{job.id}</div>
                      <div>Vehicle: {job.assignedVehicleId || "N/A"}</div>
                      <div>Weight: {job.weightKg} kg</div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </>
        )}

        {assignModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-3xl">
              <h3 className="text-4xl font-bold mb-8 text-purple-700">Assign Driver to Vehicle #{selectedVehicleId}</h3>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full p-6 text-2xl border-4 border-purple-400 rounded-2xl mb-8"
              >
                <option value="">— Select Driver —</option>
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.email})</option>
                ))}
              </select>
              <div className="flex gap-6">
                <button
                  onClick={assignDriverToVehicle}
                  className="flex-1 py-6 bg-green-600 text-white text-2xl font-bold rounded-2xl hover:bg-green-700"
                >
                  Assign
                </button>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="flex-1 py-6 bg-gray-600 text-white text-2xl font-bold rounded-2xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}