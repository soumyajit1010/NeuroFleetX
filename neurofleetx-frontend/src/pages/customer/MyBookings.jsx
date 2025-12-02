import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:8080/api/bookings/customer/${user.id}`)
      .then(res => setBookings(res.data || []))
      .catch(err => console.log(err));
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-purple-700">
        My Bookings
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {bookings.map(b => (
          <div key={b.id} className="bg-white p-6 rounded-3xl shadow-xl border">
            <h2 className="text-2xl font-bold mb-2">Booking #{b.id}</h2>

            <p><strong>Status:</strong> {b.status}</p>
            <p><strong>Pickup:</strong> {b.pickupAddress}</p>
            <p><strong>Drop:</strong> {b.dropAddress}</p>
            <p><strong>Weight:</strong> {b.packageWeightKg} kg</p>
            <p><strong>Distance:</strong> {b.distanceKm?.toFixed(1)} km</p>
            <p><strong>Estimated Cost:</strong> ₹{b.estimatedCost?.toFixed(0)}</p>
            <p><strong>Recommended Vehicle:</strong> {b.recommendedVehicleId}</p>

            <p className="text-sm text-gray-500 mt-2">
              Requested on {b.createdAt?.replace("T", " ")}
            </p>
          </div>
        ))}

        {bookings.length === 0 && (
          <p className="text-center text-2xl text-gray-600">
            No bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}
