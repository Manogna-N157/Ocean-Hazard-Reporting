import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet's default icon path issues with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ hazards, height = '400px' }) => {
  // Default center (India roughly)
  const defaultCenter = [20.5937, 78.9629];

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hazards && hazards.map((hazard) => (
          <Marker 
            key={hazard.id || hazard._id || Math.random()} 
            position={[hazard.latitude, hazard.longitude]}
          >
            <Popup>
              <div style={{ minWidth: '200px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: 'var(--color-primary)' }}>{hazard.type}</h4>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><strong>Location:</strong> {hazard.location}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><strong>Severity:</strong> {hazard.severity}</p>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px' }}><strong>Status:</strong> {hazard.status}</p>
                <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid #eee' }} />
                <p style={{ margin: '0', fontSize: '12px' }}>{hazard.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
