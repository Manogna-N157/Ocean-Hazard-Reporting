import React, { useEffect, useState } from 'react';
import MapComponent from '../components/MapComponent';
import api from '../services/api';

const HazardMap = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVerifiedHazards = async () => {
      try {
        // This dedicated endpoint returns every verified report, independent of the viewer.
        const response = await api.get('/reports/map');
        setHazards(response.data?.reports || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load verified hazard reports.');
      } finally { setLoading(false); }
    };
    fetchVerifiedHazards();
  }, []);

  return <div className="main-content">
    <div style={{ marginBottom: '2rem' }}>
      <h2>Live Ocean Hazard Map</h2>
      <p className="text-muted">All verified ocean hazards reported across the OceanGuard network.</p>
    </div>
    {error && <div className="notice notice-error">{error}</div>}
    <div className="card" style={{ padding: 0 }}>
      {loading ? <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading verified hazard reports...</div> : <MapComponent hazards={hazards} height="600px" />}
    </div>
    {!loading && !error && !hazards.length && <p className="text-muted text-center mt-4">No verified hazard reports are available on the map yet.</p>}
    <div className="grid-4 mt-4">
      <div className="card text-center" style={{ padding: '1rem' }}><div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-danger)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div><span style={{ fontSize: '0.9rem', fontWeight: '500' }}>High Risk (Red)</span></div>
      <div className="card text-center" style={{ padding: '1rem' }}><div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-warning)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div><span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Medium Risk (Orange)</span></div>
      <div className="card text-center" style={{ padding: '1rem' }}><div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-success)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div><span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Low Risk (Green)</span></div>
      <div className="card text-center" style={{ padding: '1rem' }}><div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div><span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Verified Incidents</span></div>
    </div>
  </div>;
};
export default HazardMap;
