import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const API_ORIGIN = 'http://localhost:5000';

// Fix Leaflet's default icon path issues with Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapComponent = ({ hazards, height = '400px' }) => {
  const defaultCenter = [20.5937, 78.9629];

  const getRiskBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'high') {
      return <span className="badge badge-high">High Risk</span>;
    }
    if (l === 'medium') {
      return <span className="badge badge-medium">Medium Risk</span>;
    }
    if (l === 'low') {
      return <span className="badge badge-low">Low Risk</span>;
    }
    return <span className="badge badge-pending">Pending AI</span>;
  };

  const getStatusBadge = (st) => {
    const s = (st || '').toLowerCase();
    if (s === 'verified') return <span className="badge badge-verified">Verified</span>;
    if (s === 'rejected') return <span className="badge badge-high" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Rejected</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div style={{ height, width: '100%', borderRadius: 'var(--border-radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <MapContainer center={defaultCenter} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {hazards &&
          hazards.map((hazard) => {
            const lat = Number(hazard.latitude);
            const lng = Number(hazard.longitude);
            if (isNaN(lat) || isNaN(lng)) return null;

            const hazardName = hazard.aiAnalysis?.hazard_prediction || hazard.type || hazard.hazard_type || 'Ocean Hazard';
            const riskLevel = hazard.aiAnalysis?.risk_level || hazard.risk_level || 'Medium';
            const recommendation = hazard.aiAnalysis?.recommendation || hazard.recommendation || 'Proceed with caution near reported zone.';
            const imageUrl = hazard.image_url ? (hazard.image_url.startsWith('http') ? hazard.image_url : `${API_ORIGIN}${hazard.image_url}`) : null;

            return (
              <Marker key={hazard.id || Math.random()} position={[lat, lng]}>
                <Popup style={{ minWidth: '240px' }}>
                  <div style={{ padding: '0.25rem' }}>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Uploaded hazard evidence"
                        style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', marginBottom: '0.5rem' }}
                      />
                    )}
                    <h4 style={{ margin: '0 0 4px 0', color: 'var(--color-primary)', fontSize: '1.05rem' }}>{hazardName}</h4>
                    <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: '#64748b' }}>
                      <strong>Location:</strong> {hazard.location}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <div>{getRiskBadge(riskLevel)}</div>
                      <div>{getStatusBadge(hazard.status)}</div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                      <strong>AI Recommendation:</strong>
                      <p style={{ margin: '0.2rem 0 0 0', color: '#334155' }}>{recommendation}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;

