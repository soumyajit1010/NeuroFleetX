// src/pages/dashboards/DriverDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEPOT = { lat: 19.0760, lng: 72.8777 };

export default function DriverDashboard() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);
  const [driverName, setDriverName] = useState("Driver");

  useEffect(() => {
    // Get logged-in driver's ID from your auth context or localStorage
    // Replace this with your actual auth method
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setDriverId(user.id);
      setDriverName(user.name || "Driver");
      fetchMyDeliveries(user.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMyDeliveries = async (id) => {
    try {
      setLoading(true);
      // This endpoint gets all jobs assigned to this driver
      const res = await axios.get(`http://localhost:8080/api/deliveries/driver/${id}`);
      setDeliveries(res.data || []);
    } catch (err) {
      console.error("No deliveries found for driver:", err);
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
        <p className="text-6xl font-bold text-purple-700">Loading Your Route...</p>
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-8xl font-extrabold text-purple-700 mb-8">
            Hello, {driverName}!
          </h1>
          <div className="bg-white rounded-3xl shadow-3xl p-20 border-8 border-purple-300">
            <p className="text-5xl text-gray-700 mb-10">
              No deliveries assigned yet.
            </p>
            <p className="text-3xl text-purple-600">
              Check back later or contact Fleet Manager
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Group deliveries by vehicle/plan
  const routes = deliveries.reduce((acc, job) => {
    const key = job.assignedVehicleId || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(job);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-8xl font-extrabold text-center mb-12 text-purple-700">
          {driverName}'s Route Today
        </h1>
        <p className="text-4xl text-center mb-16 text-purple-600">
          {deliveries.length} Deliveries • {Object.keys(routes).length} Vehicle{Object.keys(routes).length > 1 ? "s" : ""}
        </p>

        {Object.entries(routes).map(([vehicleId, jobs]) => {
          const sortedJobs = jobs.sort((a, b) => a.sequenceInRoute - b.sequenceInRoute);
          const polyline = [[DEPOT.lat, DEPOT.lng], ...sortedJobs.map(j => [j.latitude, j.longitude]), [DEPOT.lat, DEPOT.lng]];

          return (
            <div key={vehicleId} className="mb-20">
              <div className="bg-white rounded-3xl shadow-3xl p-8 mb-8 border-8 border-indigo-300">
                <h2 className="text-5xl font-bold text-indigo-700 mb-4">
                  Vehicle #{vehicleId} • {jobs.length} Stops
                </h2>
              </div>

              <div className="h-96 rounded-3xl overflow-hidden shadow-3xl border-12 border-indigo-400 mb-10">
                <MapContainer center={[DEPOT.lat, DEPOT.lng]} zoom={11} style={{ height: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[DEPOT.lat, DEPOT.lng]}>
                    <Popup><strong>DEPOT</strong></Popup>
                  </Marker>
                  <Polyline positions={polyline} color="#6366f1" weight={10} opacity={0.9} />
                  {sortedJobs.map((job, idx) => (
                    <Marker key={job.id} position={[job.latitude, job.longitude]}>
                      <Popup>
                        <div className="text-lg font-bold">Stop {idx + 1}</div>
                        <div>{job.customerName || "Customer"}</div>
                        <div>{job.address}</div>
                        <div>Weight: {job.weightKg} kg</div>
                        <div>Phone: {job.phone || "N/A"}</div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedJobs.map((job, idx) => (
                  <div key={job.id} className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-indigo-200">
                    <div className="text-3xl font-bold text-indigo-700 mb-4">
                      Stop {idx + 1}
                    </div>
                    <p className="text-2xl font-semibold">{job.customerName || "Unknown Customer"}</p>
                    <p className="text-lg text-gray-700 mt-2">{job.address}</p>
                    <p className="text-lg mt-4">Phone: {job.phone || "N/A"}</p>
                    <p className="text-lg">Weight: {job.weightKg} kg</p>
                    <div className="mt-6 flex gap-4">
                      <button className="flex-1 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700">
                        Call Customer
                      </button>
                      <button className="flex-1 py-4 bg-indigo-600 text-white text-xl font-bold rounded-xl hover:bg-indigo-700">
                        Navigate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}