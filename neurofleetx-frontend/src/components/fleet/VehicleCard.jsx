export default function VehicleCard({ vehicle, onSimulate }) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg border-l-4 ${vehicle.status === "IN_USE" ? "border-green-500" : "border-gray-300"}`}>
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 rounded-t-2xl">
        <h3 className="font-bold text-lg">{vehicle.licensePlate}</h3>
        <p className="text-sm opacity-90">{vehicle.make} {vehicle.model}</p>
      </div>
      <div className="p-5">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${vehicle.status === "IN_USE" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
          {vehicle.status || "AVAILABLE"}
        </span>
        <p className="text-3xl font-bold text-indigo-600 mt-4">{(vehicle.speed || 0).toFixed(0)} km/h</p>
        <button onClick={() => onSimulate(vehicle.id)} className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-bold">
          Send Fake GPS
        </button>
      </div>
    </div>
  );
}