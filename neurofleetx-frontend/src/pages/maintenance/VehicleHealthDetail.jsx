import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function VehicleHealthDetail() {
  const { id } = useParams();
  const [health, setHealth] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/vehicles/${id}`).then((res) => setVehicle(res.data));
    axios.get(`http://localhost:8080/api/health/${id}`).then((res) => setHealth(res.data));
    axios.get(`http://localhost:8080/api/health/${id}/predict`).then((res) => setPrediction(res.data));
    axios.get(`http://localhost:8080/api/telemetry/${id}/latest`).then((res) => setTelemetry(res.data));
    axios.get(`http://localhost:8080/api/maintenance/${id}`).then((res) => setLogs(res.data));
  }, [id]);

  if (!vehicle || !health) {
    return <div className="text-center text-4xl p-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-purple-50 to-blue-50">
      <Link className="text-xl text-blue-700 underline" to="/dashboard/maintenance">← Back</Link>

      <h1 className="text-5xl font-bold mt-6 text-purple-700">
        {vehicle.make} {vehicle.model}
      </h1>
      <p className="text-gray-600 text-xl mb-10">{vehicle.registrationNumber}</p>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-6xl">
        {[
          { label: "Engine Health", val: health.engineHealth },
          { label: "Battery Health", val: health.batteryHealth },
          { label: "Tyre Health", val: health.tyreHealth },
          { label: "Brake Health", val: health.brakeHealth },
        ].map((item) => (
          <div key={item.label} className="p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="text-2xl font-bold">{item.label}</h3>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-4">
              <div
                className="h-4 bg-green-500 rounded-full"
                style={{ width: `${item.val}%` }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">{item.val}%</p>
          </div>
        ))}
      </div>

      {/* Prediction Box */}
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl mb-12">
        <h2 className="text-3xl font-bold text-purple-600">AI Prediction</h2>
        <p className="mt-4 text-xl"><strong>Risk:</strong> {prediction?.risk}</p>
        <p className="text-xl"><strong>Estimated Days Remaining:</strong> {prediction?.daysRemaining}</p>
        <p className="text-xl"><strong>Overall Health:</strong> {prediction?.overallHealth}%</p>
      </div>

      {/* Latest Telemetry */}
      {telemetry && (
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-3xl mb-12">
          <h2 className="text-3xl font-bold text-blue-600">Latest Telemetry</h2>

          <p className="mt-4"><strong>Speed:</strong> {telemetry.speed} km/h</p>
          <p><strong>Fuel Level:</strong> {telemetry.fuelLevel}%</p>
          <p><strong>Engine Temp:</strong> {telemetry.engineTemp}°C</p>
          <p><strong>GPS:</strong> {telemetry.gpsLat}, {telemetry.gpsLng}</p>
          <p className="text-gray-600 mt-2 text-sm">{telemetry.timestamp}</p>
        </div>
      )}

      {/* Maintenance Logs */}
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Maintenance Logs</h2>

        {logs.length === 0 ? (
          <p className="text-gray-600">No logs yet.</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="p-6 bg-gray-50 border rounded-xl shadow">
                <p><strong>Service Type:</strong> {log.serviceType}</p>
                <p><strong>Date:</strong> {log.serviceDate}</p>
                <p><strong>Cost:</strong> ₹{log.cost}</p>
                <p><strong>Mechanic:</strong> {log.mechanicName}</p>
                <p className="text-sm text-gray-500">{log.notes}</p>
              </div>
            ))}
          </div>
        )}

        <Link
          to={`/dashboard/maintenance/add/${id}`}
          className="mt-6 inline-block px-6 py-3 bg-green-600 text-white rounded-xl font-bold"
        >
          Add Maintenance Log
        </Link>
      </div>
    </div>
  );
}
