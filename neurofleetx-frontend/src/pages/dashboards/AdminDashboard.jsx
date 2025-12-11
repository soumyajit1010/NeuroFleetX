// src/pages/dashboards/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "leaflet/dist/leaflet.css";

const DEPOT = { lat: 19.0760, lng: 72.8777 };

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [heatmapData, setHeatmapData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [topDrivers, setTopDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [statsRes, jobsRes, driversRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/stats"),
        axios.get("http://localhost:8080/api/admin/heatmap"),
        axios.get("http://localhost:8080/api/admin/top-drivers")
      ]);

      setStats(statsRes.data);
      setHeatmapData(jobsRes.data);
      setTopDrivers(driversRes.data);

      // Generate hourly chart data
      const hours = Array.from({length: 24}, (_, i) => ({
        hour: `${i}:00`,
        deliveries: jobsRes.data.filter(j => new Date(j.createdAt).getHours() === i).length
      }));
      setHourlyData(hours);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-6xl text-purple-700 font-bold">Loading Urban Insights...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <h1 className="text-8xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-600">
        NEUROFLEETX • Urban Mobility Intelligence
      </h1>

      {/* Top Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <StatCard title="Active Vehicles" value={stats.activeVehicles || 0} color="from-green-500 to-emerald-600" />
        <StatCard title="Deliveries Today" value={stats.deliveriesToday || 0} color="from-blue-500 to-cyan-600" />
        <StatCard title="On-Time Rate" value={(stats.onTimeRate || 0) + "%"} color="from-purple-500 to-pink-600" />
        <StatCard title="Revenue (₹)" value={new Intl.NumberFormat('en-IN').format(stats.revenue || 0)} color="from-yellow-500 to-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        {/* Heatmap */}
        <div className="bg-black/50 backdrop-blur rounded-3xl p-8 border border-purple-500">
          <h2 className="text-4xl font-bold mb-6 text-cyan-400">Delivery Density Heatmap</h2>
          <div className="h-96 rounded-2xl overflow-hidden">
            <MapContainer center={[DEPOT.lat, DEPOT.lng]} zoom={11} style={{ height: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {heatmapData.map((job, i) => (
                <CircleMarker
                  key={i}
                  center={[job.latitude, job.longitude]}
                  radius={12}
                  fillOpacity={0.6}
                  color="#ff006e"
                  weight={1}
                >
                  <Popup>{job.customerName || "Delivery"} • {job.address}</Popup>
                </CircleMarker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Hourly Pattern */}
        <div className="bg-black/50 backdrop-blur rounded-3xl p-8 border border-cyan-500">
          <h2 className="text-4xl font-bold mb-6 text-pink-400">Peak Delivery Hours</h2>
          <ResponsiveContainer width="100%" height={384}>
            <BarChart data={hourlyData} >
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="hour" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ background: "#111", border: "1px solid #ff006e" }} />
              <Bar dataKey="deliveries" fill="#ff006e" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Drivers Leaderboard */}
      <div className="bg-black/60 backdrop-blur rounded-3xl p-10 border-4 border-yellow-500">
        <h2 className="text-5xl font-bold text-center mb-10 text-yellow-400">Driver Performance Leaderboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topDrivers.slice(0, 3).map((driver, idx) => (
            <div key={driver.id} className="text-center">
              <div className="text-8xl mb-4">
                {idx === 0 ? "Gold Medal" : idx === 1 ? "Silver Medal" : "Bronze Medal"}
              </div>
              <p className="text-4xl font-bold">{driver.name}</p>
              <p className="text-2xl text-gray-300">{driver.completed} deliveries</p>
              <p className="text-6xl mt-4">{idx === 0 ? "1st" : idx === 1 ? "2nd" : "3rd"}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-20 text-3xl text-gray-400">
        NeuroFleetX • Saving <strong className="text-green-400">{(stats.carbonSaved || 0).toFixed(1)} tons</strong> CO₂ this month
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition`}>
      <p className="text-2xl opacity-90">{title}</p>
      <p className="text-6xl font-extrabold mt-4">{value}</p>
    </div>
  );
}