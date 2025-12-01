import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Fleet Operations Center</h1>
          <p className="text-slate-600">Real-time vehicle tracking • {localStorage.getItem("userEmail")}</p>
        </div>
        <div className="flex gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold">
            Simulate Telemetry
          </button>
          <Link to="/dashboard/ai-optimizer" className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition">
            AI ROUTE OPTIMIZER
          </Link>
        </div>
      </div>
    </header>
  );
}