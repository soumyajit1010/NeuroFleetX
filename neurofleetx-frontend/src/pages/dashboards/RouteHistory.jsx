// src/pages/dashboards/RouteHistory.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";


const RouteHistory = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  const location = useLocation();

useEffect(() => {
  loadPlans();
}, [location.pathname]); // refetch whenever path changes


  const loadPlans = async () => {
    setLoading(true);

    try {
      const res = await axios.get("http://localhost:8080/api/optimize/plans", {
        headers: { Accept: "application/json" }
      });

      let data = Array.isArray(res.data) ? res.data : [];

      // ⭐ SORT NEWEST FIRST ⭐
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPlans(data);
    } catch (err) {
      console.error("Failed to load plans:", err.response?.data || err.message);
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
      const dRes = await axios.get("http://localhost:8080/drivers");
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
        `http://localhost:8080/api/optimize/plans/${selectedPlanId}/routes/${selectedVehicleId}/assign`,
        { driverId: Number(selectedDriver) }
      );

      alert("Driver assigned successfully!");
      setAssignModalOpen(false);

      loadPlans();
    } catch (err) {
      alert("Failed: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-6xl text-purple-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-10">
      <h1 className="text-5xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Route History — {plans.length} Plans
      </h1>

      {plans.length === 0 ? (
        <div className="text-center">
          <p className="text-3xl text-purple-700 mb-8">No plans found yet!</p>
          <a
            href="/dashboard/ai-optimizer"
            className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold"
          >
            Run AI Optimizer
          </a>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          {plans.map((plan) => {
            const routesMap = (plan.jobs || []).reduce((map, job) => {
              const vid = job.assignedVehicleId ?? -1;
              if (!map[vid]) map[vid] = [];
              map[vid].push(job);
              return map;
            }, {});

            const routeEntries = Object.entries(routesMap);

            return (
              <div key={plan.id} className="bg-white rounded-3xl shadow-2xl p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-purple-700">
                      Plan #{plan.id}
                    </h2>
                    <p className="text-gray-600">
                      {new Date(plan.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {plan.numberOfVehicles} vehicles • {plan.jobs?.length || 0} jobs
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {routeEntries.map(([vidStr, jobsForRoute]) => {
                    const vid = Number(vidStr);
                    const assignedDriverId =
                      jobsForRoute.find((j) => j.assignedDriverId)?.assignedDriverId || null;

                    const vehicleRegNo =
                      jobsForRoute[0]?.assignedVehicleRegNo || "N/A";

                    return (
                      <div key={vidStr} className="border p-6 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-2xl font-bold">{vehicleRegNo}</h3>
                            <p className="text-sm text-gray-600">
                              {jobsForRoute.length} stops
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Vehicle ID: {vid === -1 ? "unknown" : vid}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm text-gray-700 mb-2">
                              Driver:{" "}
                              {assignedDriverId ? `#${assignedDriverId}` : "Unassigned"}
                            </p>

                            <button
                              onClick={() => openAssignModal(plan.id, vid)}
                              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow"
                            >
                              Assign Driver
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 space-y-3">
                          {jobsForRoute.map((j, idx) => (
                            <div key={j.id} className="p-3 bg-gray-50 rounded">
                              <p className="font-semibold">
                                {idx + 1}. {j.customerName}
                              </p>
                              <p className="text-sm text-gray-600">{j.address}</p>
                              <p className="text-xs text-gray-500">
                                Stop #{j.sequenceInRoute} • Weight: {j.weightKg} kg
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-4">Assign Driver</h3>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Driver
            </label>

            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full p-3 border rounded mb-6"
            >
              <option value="">-- Select driver --</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.email})
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <button
                onClick={assignDriverToVehicle}
                className="flex-1 py-3 bg-green-600 text-white rounded font-bold"
              >
                Assign
              </button>

              <button
                onClick={() => setAssignModalOpen(false)}
                className="flex-1 py-3 bg-gray-300 rounded font-bold"
              >
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
