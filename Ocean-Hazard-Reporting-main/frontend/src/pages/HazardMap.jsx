import React, { useState, useEffect } from 'react';
import MapComponent from '../components/MapComponent';
import api from '../services/api';

const HazardMap = () => {
  const [hazards, setHazards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHazards = async () => {
      try {
        const response = await api.get('/reports');
        const fetched = response.data?.reports || response.data || [];

        if (fetched.length > 0) {
          setHazards(fetched);
        } else {
          // Fallback map hazards with AI fields
          setHazards([
            {
              id: 1,
              type: 'Oil Spill',
              location: 'Mumbai Coast',
              latitude: 18.922,
              longitude: 72.8347,
              status: 'Verified',
              description: 'Large oil slick observed near harbor entrance.',
              aiAnalysis: {
                hazard_prediction: 'Oil Spill',
                confidence_score: 94,
                risk_level: 'High',
                recommendation: 'Deploy oil containment booms immediately and inform coastal guard.',
              },
            },
            {
              id: 2,
              type: 'Plastic Pollution',
              location: 'Marina Beach',
              latitude: 13.0475,
              longitude: 80.2824,
              status: 'Pending',
              description: 'Heavy plastic debris accumulation washed ashore.',
              aiAnalysis: {
                hazard_prediction: 'Plastic Pollution',
                confidence_score: 88,
                risk_level: 'Medium',
                recommendation: 'Organize municipal coastal cleanup teams.',
              },
            },
            {
              id: 3,
              type: 'Marine Animal Death',
              location: 'Kochi Port',
              latitude: 9.9312,
              longitude: 76.2673,
              status: 'Verified',
              description: 'Deceased marine species spotted near shoreline.',
              aiAnalysis: {
                hazard_prediction: 'Marine Animal Death',
                confidence_score: 91,
                risk_level: 'High',
                recommendation: 'Notify marine biology task force for toxicological testing.',
              },
            },
            {
              id: 4,
              type: 'High Waves',
              location: 'Puri Beach',
              latitude: 19.7983,
              longitude: 85.8245,
              status: 'Verified',
              description: 'High wave surge endangering coastal fishermen.',
              aiAnalysis: {
                hazard_prediction: 'High Waves',
                confidence_score: 82,
                risk_level: 'Medium',
                recommendation: 'Issue coastal surge safety advisory for fishermen.',
              },
            },
          ]);
        }
      } catch (error) {
        console.warn('Error fetching live map hazards:', error);
        // Fallback default hazards with AI risk levels
        setHazards([
          {
            id: 1,
            type: 'Oil Spill',
            location: 'Mumbai Coast',
            latitude: 18.922,
            longitude: 72.8347,
            status: 'Verified',
            description: 'Large oil slick observed near harbor.',
            aiAnalysis: {
              hazard_prediction: 'Oil Spill',
              confidence_score: 94,
              risk_level: 'High',
              recommendation: 'Deploy containment booms immediately.',
            },
          },
          {
            id: 2,
            type: 'Plastic Pollution',
            location: 'Marina Beach',
            latitude: 13.0475,
            longitude: 80.2824,
            status: 'Pending',
            description: 'Plastic debris washed ashore.',
            aiAnalysis: {
              hazard_prediction: 'Plastic Pollution',
              confidence_score: 88,
              risk_level: 'Medium',
              recommendation: 'Organize municipal beach cleanup.',
            },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHazards();
  }, []);

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Live Ocean Hazard Map</h2>
        <p className="text-muted">Geographical map view showing AI risk diagnostics and verification statuses for reported incidents.</p>
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
          <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-danger)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>High Risk (Red)</span>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-warning)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Medium Risk (Orange)</span>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-success)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Low Risk (Green)</span>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <div style={{ width: '16px', height: '16px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', margin: '0 auto 0.5rem' }}></div>
          <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Verified Incidents</span>
        </div>
      </div>
    </div>
  );
};

export default HazardMap;

