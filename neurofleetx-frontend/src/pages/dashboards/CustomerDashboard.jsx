// src/pages/dashboards/CustomerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState("");

  useEffect(() => {
    if (user) {
      setCustomerName(user.email || user.name || "Customer");
    }
  }, [user]);

  // RANDOM BOOKING GENERATOR — FOR TESTING ONLY
  const generateRandomBooking = async () => {
    if (!user?.id) {
      alert("Please login as customer first!");
      return;
    }

    const randomLocations = [
      { name: "Andheri", lat: 19.1185, lng: 72.9070 },
      { name: "Bandra", lat: 19.0561, lng: 72.8296 },
      { name: "Worli", lat: 19.0150, lng: 72.8150 },
      { name: "Dadar", lat: 19.0190, lng: 72.8420 },
      { name: "Powai", lat: 19.1180, lng: 72.9075 },
      { name: "Colaba", lat: 18.9150, lng: 72.8250 }
    ];

    const pickup = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    const drop = randomLocations.filter(l => l.name !== pickup.name)[Math.floor(Math.random() * 5)];

    const payload = {
      customerId: user.id,
      pickupAddress: `${pickup.name}, Mumbai`,
      dropAddress: `${drop.name}, Mumbai`,
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropLat: drop.lat,
      dropLng: drop.lng,
      packageWeightKg: Math.floor(Math.random() * 25) + 1,
      preferredTime: new Date(Date.now() + 7200000).toISOString().slice(0, 16)
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", payload);
      alert(`Random Booking Created!\nFrom: ${pickup.name} → To: ${drop.name}`);
    } catch (err) {
      alert("Failed to create booking");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          Welcome Back!
        </h1>
        <p className="text-3xl text-center mb-12 text-gray-700">
          Hello, <span className="font-bold text-purple-700">{customerName}</span>
        </p>

        {/* TESTING BUTTON — ONLY VISIBLE TO YOU */}
        <div className="text-center mb-12">
          <button
            onClick={generateRandomBooking}
            className="px-14 py-6 bg-gradient-to-r from-red-600 to-pink-600 text-white text-2xl font-bold rounded-full shadow-2xl hover:scale-110 transition transform"
          >
            Generate Random Booking (Testing Only)
          </button>
        </div>

        {/* MAIN ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          <Link
            to="/dashboard/customer/book"
            className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-indigo-200 hover:shadow-3xl hover:border-indigo-500 transition transform hover:scale-105"
          >
            <div className="text-7xl mb-6">New Booking</div>
            <h2 className="text-4xl font-bold text-indigo-700">Request Delivery</h2>
            <p className="mt-4 text-xl text-gray-600">Book a new pickup & delivery</p>
          </Link>

          {/* THIS IS YOUR CORRECT PATH */}
          <Link
            to="/dashboard/customer/my-bookings"
            className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-green-200 hover:shadow-3xl hover:border-green-500 transition transform hover:scale-105"
          >
            <div className="text-7xl mb-6">My Bookings</div>
            <h2 className="text-4xl font-bold text-green-700">View All Bookings</h2>
            <p className="mt-4 text-xl text-gray-600">Track your delivery requests</p>
          </Link>

          <Link
            to="/dashboard/customer/recommendations"
            className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-purple-200 hover:shadow-3xl hover:border-purple-500 transition transform hover:scale-105"
          >
            <div className="text-7xl mb-6">Smart Suggestions</div>
            <h2 className="text-4xl font-bold text-purple-700">AI Recommendations</h2>
            <p className="mt-4 text-xl text-gray-600">Best price, vehicle & time</p>
          </Link>

          <Link
            to="/dashboard/customer/track"
            className="bg-white p-12 rounded-3xl shadow-2xl border-4 border-orange-200 hover:shadow-3xl hover:border-orange-500 transition transform hover:scale-105"
          >
            <div className="text-7xl mb-6">Live Tracking</div>
            <h2 className="text-4xl font-bold text-orange-700">Track Your Delivery</h2>
            <p className="mt-4 text-xl text-gray-600">Real-time driver location & ETA</p>
          </Link>
        </div>
      </div>
    </div>
  );
}