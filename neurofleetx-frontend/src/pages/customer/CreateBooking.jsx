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
      { name: "Powai", lat: 19.1180, lng: 72.9075 }
    ];

    const pickup = randomLocations[Math.floor(Math.random() * randomLocations.length)];
    const drop = randomLocations.filter(l => l.name !== pickup.name)[Math.floor(Math.random() * 4)];

    const payload = {
      customerId: user.id,
      pickupAddress: `${pickup.name}, Mumbai`,
      dropAddress: `${drop.name}, Mumbai`,
      pickupLat: pickup.lat,
      pickupLng: pickup.lng,
      dropLat: drop.lat,
      dropLng: drop.lng,
      packageWeightKg: Math.floor(Math.random() * 20) + 1,
      preferredTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16)
    };

    try {
      await axios.post("http://localhost:8080/api/bookings", payload);
      alert(`Random booking created!\nPickup: ${pickup.name}\nDrop: ${drop.name}`);
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

        {/* TESTING BUTTON — ONLY FOR YOU */}
        <div className="text-center mb-10">
          <button
            onClick={generateRandomBooking}
            className="px-12 py-5 bg-gradient-to-r from-red-600 to-pink-600 text-white text-xl font-bold rounded-full shadow-2xl hover:scale-110 transition transform"
          >
            Generate Random Booking (Testing Only)
          </button>
        </div>

        {/* MAIN ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">

          {/* New Booking */}
          <Link
            to="/dashboard/customer/book"
            className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-indigo-200 hover:shadow-3xl hover:border-indigo-400 transition transform hover:scale-105"
          >
            <div className="text-6xl mb-4">New Booking</div>
            <h2 className="text-3xl font-bold text-indigo-700">Request Delivery</h2>
            <p className="mt-4 text-gray-600 text-lg">Book a new pickup & delivery</p>
          </Link>

          {/* My Bookings — NOW WORKS! */}
          <Link
            to="/dashboard/customer/bookings"
            className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-green-200 hover:shadow-3xl hover:border-green-400 transition transform hover:scale-105"
          >
            <div className="text-6xl mb-4">My Bookings</div>
            <h2 className="text-3xl font-bold text-green-700">View All Bookings</h2>
            <p className="mt-4 text-gray-600 text-lg">See status of all your requests</p>
          </Link>

          {/* Smart Suggestions — COMING SOON PAGE */}
          <div
            onClick={() => navigate("/dashboard/customer/recommendations")}
            className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-purple-200 hover:shadow-3xl hover:border-purple-400 transition transform hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl mb-4">Smart Suggestions</div>
            <h2 className="text-3xl font-bold text-purple-700">AI Recommendations</h2>
            <p className="mt-4 text-gray-600 text-lg">Best vehicle, price & time</p>
          </div>

          {/* Live Tracking — COMING SOON PAGE */}
          <div
            onClick={() => navigate("/dashboard/customer/track")}
            className="bg-white p-10 rounded-3xl shadow-2xl border-4 border-orange-200 hover:shadow-3xl hover:border-orange-400 transition transform hover:scale-105 cursor-pointer"
          >
            <div className="text-6xl mb-4">Live Tracking</div>
            <h2 className="text-3xl font-bold text-orange-700">Track Your Delivery</h2>
            <p className="mt-4 text-gray-600 text-lg">Real-time driver location & ETA</p>
          </div>
        </div>
      </div>
    </div>
  );
}