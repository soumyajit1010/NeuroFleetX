import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const statusColor = (health) => {
  if (health >= 80) return "bg-green-500";
  if (health >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

export default function VehicleHealthDashboard() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/vehicles")
      .then(async (res) => {
        const list = res.data;

        // Fetch health for each vehicle
        const enriched = await Promise.all(
          list.map(async (v) => {
            try {
              const healthRes = await axios.get(`http://localhost:8080/api/health/${v.id}`);
              const predRes = await axios.get(`http://localhost:8080/api/health/${v.id}/predict`);
              return { ...v, health: healthRes.data, prediction: predRes.data };
            } catch {
              return { ...v, health: null, prediction: null };
            }
          })
        );

        setVehicles(enriched);
      });
  }, []);

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
        Predictive Maintenance Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {vehicles.map((v) => (
          <Link to={`/dashboard/health/${v.id}`} key={v.id} className="block">
            <div className="bg-white p-8 rounded-3xl shadow-xl hover:scale-105 transition">
              <h2 className="text-3xl font-bold text-purple-700">{v.make} {v.model}</h2>
              <p className="text-gray-600">{v.registrationNumber || v.licensePlate}</p>

              {v.health ? (
                <>
                  <div className="mt-6">
                    <p className="font-semibold text-xl">Overall Health</p>
                    <div className="w-full bg-gray-200 rounded-full h-6 mt-2">
                      <div
                        className={`h-6 rounded-full ${statusColor(v.health.overallHealth)}`}
                        style={{ width: `${v.health.overallHealth}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-600 mt-1">{v.health.overallHealth}%</p>
                  </div>

                  <div className="mt-4 text-sm">
                    <p><strong>Risk:</strong> {v.prediction?.risk}</p>
                    <p><strong>Days Remaining:</strong> {v.prediction?.daysRemaining}</p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500 mt-4">Health data not available</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
