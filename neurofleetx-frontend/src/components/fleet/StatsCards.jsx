export default function StatsCards({ vehicles }) {
  const active = vehicles.filter(v => v.status === "IN_USE").length;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <p className="text-sm text-gray-600">Total Vehicles</p>
        <p className="text-4xl font-bold mt-2">{vehicles.length}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-green-200">
        <p className="text-sm text-gray-600">On Road</p>
        <p className="text-4xl font-bold text-green-600 mt-2">{active}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-200">
        <p className="text-sm text-gray-600">Available</p>
        <p className="text-4xl font-bold text-blue-600 mt-2">{vehicles.length - active}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border">
        <p className="text-sm text-gray-600">Last Update</p>
        <p className="text-2xl font-semibold mt-2">{new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
}