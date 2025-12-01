import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function LiveMap({ vehicles }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">Live Vehicle Tracking</h2>
      </div>
      <div style={{ height: "560px" }}>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {vehicles
            .filter(v => v.latitude && v.longitude)
            .map(v => (
              <Marker
                key={v.id}
                position={[v.latitude, v.longitude]}
                icon={L.divIcon({
                  html: `<div style="background:linear-gradient(135deg,#6366f1,#a855f7);color:white;width:40px;height:40px;border-radius:50%;border:4px solid white;box-shadow:0 4px 20px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:11px;">
                    ${v.licensePlate.slice(-4)}
                  </div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 40],
                })}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-indigo-700">{v.licensePlate}</h3>
                    <p>{v.make} {v.model}</p>
                    <p>Speed: {v.speed || 0} km/h</p>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
}