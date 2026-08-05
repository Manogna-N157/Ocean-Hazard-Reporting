import React from 'react';
import AlertCard from '../components/AlertCard';

const Alerts = () => {
  // Dummy alerts data
  const alerts = [
    {
      id: 1,
      title: 'Major Oil Spill Detected',
      type: 'Oil Spill',
      location: 'Mumbai Coast, Maharashtra',
      severity: 'High',
      description: 'A major oil spill has been confirmed near the Mumbai harbor. Coastal authorities are requested to take immediate containment actions.',
      date: '2026-08-04T08:30:00Z'
    },
    {
      id: 2,
      title: 'Approaching Cyclone Warning',
      type: 'Cyclone',
      location: 'Bay of Bengal',
      severity: 'High',
      description: 'A deep depression is forming in the Bay of Bengal, expected to develop into a severe cyclonic storm. Fishermen are advised not to venture into the sea.',
      date: '2026-08-03T18:00:00Z'
    },
    {
      id: 3,
      title: 'Elevated Plastic Debris',
      type: 'Plastic Pollution',
      location: 'Marina Beach, Chennai',
      severity: 'Medium',
      description: 'Significant plastic pollution reported washing ashore due to recent high tides. Cleanup crews have been dispatched.',
      date: '2026-08-03T10:15:00Z'
    }
  ];

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Emergency Alerts</h2>
        <p className="text-muted">Real-time alerts and warnings regarding severe ocean hazards.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {alerts.map(alert => (
          <AlertCard key={alert.id} alert={alert} />
        ))}
      </div>
    </div>
  );
};

export default Alerts;
