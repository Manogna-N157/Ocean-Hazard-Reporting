import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import api from '../services/api';

const HazardMap = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch from API
    const fetchHazards = async () => {
      try {
        // const response = await api.get('/hazards/map');
        // setHazards(response.data);
        
        // Dummy data for prototype
        setTimeout(() => {
          setHazards([
            { id: 1, type: 'Oil Spill', location: 'Mumbai Coast', latitude: 18.9220, longitude: 72.8347, severity: 'High', status: 'Verified', description: 'Large oil slick observed near the harbor.' },
            { id: 2, type: 'Plastic Pollution', location: 'Marina Beach', latitude: 13.0475, longitude: 80.2824, severity: 'Medium', status: 'Pending', description: 'Heavy plastic debris washed ashore.' },
            { id: 3, type: 'Marine Animal Death', location: 'Kochi', latitude: 9.9312, longitude: 76.2673, severity: 'High', status: 'Verified', description: 'Several dead fish found along the coast.' },
            { id: 4, type: 'High Waves', location: 'Puri Beach', latitude: 19.7983, longitude: 85.8245, severity: 'Medium', status: 'Verified', description: 'Unusually high waves reported by local fishermen.' }
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching hazards", error);
        setLoading(false);
      }
    };

    fetchHazards();
  }, []);

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Live Ocean Hazard Map</h2>
        <p className="text-muted">Real-time geographical view of reported and verified ocean hazards across the coast.</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ height: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            Loading map data...
          </div>
        ) : (
          <MapComponent hazards={hazards} height="600px" />
        )}
      </div>
      
      <div className="grid-4 mt-4">
         <div className="card text-center" style={{ padding: '1rem' }}>
           <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
           <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Oil Spill</span>
         </div>
         <div className="card text-center" style={{ padding: '1rem' }}>
           <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-secondary)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
           <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Plastic Pollution</span>
         </div>
         <div className="card text-center" style={{ padding: '1rem' }}>
           <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-danger)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
           <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Marine Animal Death</span>
         </div>
         <div className="card text-center" style={{ padding: '1rem' }}>
           <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-warning)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
           <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>High Waves</span>
         </div>
      </div>
    </div>
  );
};

export default HazardMap;
