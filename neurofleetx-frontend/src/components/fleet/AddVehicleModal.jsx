// src/components/fleet/AddVehicleModal.jsx
import React, { useState } from "react";
import axios from "axios";

export default function AddVehicleModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    licensePlate: "",
    make: "",
    model: "",
    manufacturingYear: "",
    vin: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/vehicles", {
        licensePlate: formData.licensePlate.trim(),
        make: formData.make.trim(),
        model: formData.model.trim(),
        manufacturingYear: parseInt(formData.manufacturingYear),
        vin: formData.vin.trim(),
      });
      onSuccess();
      onClose();
      alert("Vehicle added!");
    } catch (err) {
      alert("Failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Add New Vehicle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="License Plate (MH04AB1234)"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-indigo-300"
            required
          />
          <input
            placeholder="Make (Tata)"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <input
            placeholder="Model (Nexon)"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <input
            type="number"
            placeholder="Year (2025)"
            value={formData.manufacturingYear}
            onChange={(e) => setFormData({ ...formData, manufacturingYear: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <input
            placeholder="VIN"
            value={formData.vin}
            onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
            required
          />
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition"
            >
              Add Vehicle
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 py-3 rounded-xl font-bold hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}