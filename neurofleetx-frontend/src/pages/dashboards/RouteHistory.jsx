// src/pages/dashboards/RouteHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const RouteHistory = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      // THIS IS THE CORRECT ENDPOINT — 103 PLANS WILL LOAD!
      const res = await axios.get("http://localhost:8080/api/optimize/route-plans/all");
      
      const data = Array.isArray(res.data) ? res.data : [];
      const sorted = data.sort((a, b) => b.id - a.id);
      setPlans(sorted);
    } catch (err) {
      console.error("Failed to load plans:", err);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = async (planId, vehicleId) => {
    setSelectedPlanId(planId);
    setSelectedVehicleId(vehicleId);
    setAssignModalOpen(true);
    setSelectedDriver("");

    try {
      const dRes = await axios.get("http://localhost:8080/api/drivers");
      setDrivers(dRes.data || []);
    } catch {
      setDrivers([]);
    }
  };

  const assignDriverToVehicle = async () => {
    if (!selectedDriver) return alert("Select a driver");

    try {
      await axios.put(
        `http://localhost:8080/api/optimize/plans/${selectedPlanId}/routes/${selectedVehicleId}/assign`,
        { driverId: Number(selectedDriver) }
      );
      alert("Driver assigned!");
      setAssignModalOpen(false);
      loadPlans();
    } catch (err) {
      alert("Failed: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-6xl text-purple-600 font-bold">
        Loading 103+ Plans...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-10">
      <h1 className="text-7xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
        Route History — {plans.length} Plans
      </h1>

      {plans.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl text-gray-600 mb-8">No plans found</p>
          <a href="/dashboard/ai-optimizer" className="px-16 py-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-4xl font-bold rounded-3xl shadow-2xl hover:scale-110 transition">
            Run AI Optimizer
          </a>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-10">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-3xl shadow-2xl p-10 border-4 border-purple-200">
              <h2 className="text-5xl font-bold text-purple-700 mb-4">Plan #{plan.id}</h2>
              <p className="text-2xl text-gray-600 mb-6">
                {new Date(plan.createdAt).toLocaleString()} • {plan.numberOfVehicles} vehicles • {plan.jobs?.length || 0} jobs
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...new Set(plan.jobs?.map(j => j.assignedVehicleId) || [])].map(vid => {
                  const routeJobs = plan.jobs.filter(j => j.assignedVehicleId === vid);
                  const driverId = routeJobs[0]?.assignedDriverId;

                  return (
                    <div key={vid} className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-4 border-purple-300">
                      <h3 className="text-3xl font-bold text-purple-800">Vehicle #{vid}</h3>
                      <p className="text-xl mt-2">Stops: {routeJobs.length}</p>
                      <p className="text-xl mt-4">
                        Driver: <strong>{driverId ? `ID ${driverId}` : "Not Assigned"}</strong>
                      </p>
                      <button
                        onClick={() => openAssignModal(plan.id, vid)}
                        className="mt-6 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xl font-bold rounded-xl shadow-lg hover:scale-110 transition"
                      >
                        Assign Driver
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 max-w-md w-full shadow-3xl">
            <h3 className="text-4xl font-bold mb-8 text-purple-700">Assign Driver</h3>
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
              <button onClick={assignDriverToVehicle} className="flex-1 py-6 bg-green-600 text-white text-2xl font-bold rounded-2xl hover:bg-green-700">
                Assign
              </button>
              <button onClick={() => setAssignModalOpen(false)} className="flex-1 py-6 bg-gray-600 text-white text-2xl font-bold rounded-2xl">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteHistory;