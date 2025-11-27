import { useState, useEffect } from 'react';

export default function VehicleTable() {
  const [vehicles, setVehicles] = useState([]);
  const [plate, setPlate] = useState('');

  const load = () => fetch('http://localhost:8080/api/vehicles').then(r => r.json()).then(setVehicles);

  useEffect(() => {
    load();
    const id = setInterval(load, 3000); // refresh every 3 seconds
    return () => clearInterval(id);
  }, []);

  const add = () => {
    fetch('http://localhost:8080/api/vehicles', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({licensePlate: plate, make:"Tata", model:"Nexon", manufacturingYear:2025, vin:"VIN"+Date.now()})
    }).then(() => { setPlate(''); load(); });
  };

  return (
    <div style={{padding:20, fontFamily:'Arial'}}>
      <h1>Fleet Inventory & Telemetry</h1>
      
      <div style={{marginBottom:20}}>
        <input value={plate} onChange={e=>setPlate(e.target.value)} placeholder="License Plate" />
        <button onClick={add} style={{marginLeft:10, padding:'8px 16px'}}>Add Vehicle</button>
      </div>

      <table border="1" style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f0f0f0'}}>
            <th>ID</th><th>Plate</th><th>Make/Model</th><th>Status</th>
            <th>Location</th><th>Speed</th><th>Fuel</th><th>Last Update</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} style={{background: v.speed>80 ? '#ffaaaa' : 'white'}}>
              <td>{v.id}</td>
              <td><strong>{v.licensePlate}</strong></td>
              <td>{v.make} {v.model}</td>
              <td>{v.status}</td>
              <td>{v.latitude?.toFixed(4) || '-'}, {v.longitude?.toFixed(4) || '-'}</td>
              <td>{v.speed?.toFixed(0) || 0} km/h</td>
              <td>{v.fuelLevel?.toFixed(0) || 0}%</td>
              <td>{v.lastUpdated ? new Date(v.lastUpdated).toLocaleTimeString() : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => {
        // Simulate random telemetry for vehicle ID=1
        fetch('http://localhost:8080/api/vehicles/1/telemetry', {
          method: 'PATCH',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({
            latitude: 19.1 + Math.random()*0.1,
            longitude: 72.8 + Math.random()*0.1,
            speed: Math.random()*120,
            fuelLevel: 20 + Math.random()*70
          })
        }).then(load);
      }} style={{marginTop:20, padding:10}}>
        Simulate Telemetry Update (Vehicle 1)
      </button>
    </div>
  );
}