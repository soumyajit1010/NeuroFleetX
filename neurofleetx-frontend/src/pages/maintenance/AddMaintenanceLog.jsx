import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AddMaintenanceLog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    serviceDate: "",
    serviceType: "",
    cost: "",
    mechanicName: "",
    notes: "",
    nextDueDate: "",
  });

  const submitForm = async () => {
    try {
      await axios.post(`http://localhost:8080/api/maintenance/${id}`, form);
      alert("Maintenance log added!");
      navigate(`/dashboard/health/${id}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen p-10 bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-4xl font-bold mb-10">Add Maintenance Log</h1>

      <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-2xl space-y-6">
        {Object.entries(form).map(([key, val]) => (
          <div key={key}>
            <label className="block font-semibold capitalize mb-1">{key}</label>
            <input
              type="text"
              value={val}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border p-3 rounded-xl"
            />
          </div>
        ))}

        <button
          onClick={submitForm}
          className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl"
        >
          Save Log
        </button>
      </div>
    </div>
  );
}
