import React, { useEffect, useState } from "react";
import axios from "axios";

export default function PendingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingBookings();
  }, []);

  const loadPendingBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/bookings/pending");
      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to load:", err);
      setBookings([]);
    }
    setLoading(false);
  };

  const approveBooking = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/approve`);
      alert("Booking approved and converted to DeliveryJob");
      loadPendingBookings();
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  const rejectBooking = async (id) => {
    if (!window.confirm("Reject this booking?")) return;

    try {
      await axios.put(`http://localhost:8080/api/bookings/${id}/reject`);
      alert("Booking rejected");
      loadPendingBookings();
    } catch (err) {
      alert("Error: " + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-4xl text-purple-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-10">
      <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
        Pending Customer Bookings
      </h1>

      {bookings.length === 0 ? (
        <p className="text-center text-3xl text-gray-600">No pending bookings.</p>
      ) : (
        <div className="max-w-6xl mx-auto space-y-8">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white p-8 rounded-3xl shadow-xl border">

              <h2 className="text-3xl font-bold mb-3">
                Booking #{b.id}
              </h2>

              <p><strong>Customer:</strong> {b.customerId}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

                <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
                  <h3 className="font-bold text-lg mb-2">Pickup</h3>
                  <p>{b.pickupAddress}</p>
                  <p className="text-sm text-gray-500">
                    Lat: {b.pickupLat}, Lng: {b.pickupLng}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
                  <h3 className="font-bold text-lg mb-2">Drop</h3>
                  <p>{b.dropAddress}</p>
                  <p className="text-sm text-gray-500">
                    Lat: {b.dropLat}, Lng: {b.dropLng}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 bg-purple-100 rounded-xl shadow">
                  <p><strong>Weight:</strong> {b.packageWeightKg} kg</p>
                </div>
                <div className="p-4 bg-blue-100 rounded-xl shadow">
                  <p><strong>Distance:</strong> {b.distanceKm?.toFixed(1)} km</p>
                </div>
                <div className="p-4 bg-green-100 rounded-xl shadow">
                  <p><strong>Estimated Cost:</strong> ₹{b.estimatedCost?.toFixed(0)}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-100 border rounded-xl">
                <p><strong>Recommended Vehicle:</strong> {b.recommendedVehicleId || "Unavailable"}</p>
                <p><strong>Suggested Time:</strong> {b.preferredTime?.replace("T", " ")}</p>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => approveBooking(b.id)}
                  className="flex-1 py-3 bg-green-600 text-white text-xl font-bold rounded-xl shadow hover:scale-105 transition"
                >
                  ✔ Approve Booking
                </button>

                <button
                  onClick={() => rejectBooking(b.id)}
                  className="flex-1 py-3 bg-red-600 text-white text-xl font-bold rounded-xl shadow hover:scale-105 transition"
                >
                  ✖ Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
