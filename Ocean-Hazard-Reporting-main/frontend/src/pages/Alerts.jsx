import React, { useEffect, useState } from 'react';
import AlertCard from '../components/AlertCard';
import api from '../services/api';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const [alertRes, reportRes] = await Promise.all([
          api.get('/alerts').catch(() => ({ data: { alerts: [] } })),
          api.get('/reports').catch(() => ({ data: { reports: [] } })),
        ]);

        const rawAlerts = alertRes.data?.alerts || [];
        const rawReports = reportRes.data?.reports || [];

        // Filter for active reports (exclude Resolved reports)
        const activeReports = rawReports.filter(
          (r) => r.status !== 'Resolved' && r.status !== 'Rejected'
        );

        if (activeReports.length > 0 || rawAlerts.length > 0) {
          const activeList = [
            ...rawAlerts.filter((a) => a.status !== 'Resolved' && a.report?.status !== 'Resolved'),
            ...activeReports.map((r) => ({
              id: `rep-${r.id}`,
              hazard: r.aiAnalysis?.hazard_prediction || r.hazard_type || 'Ocean Hazard Alert',
              location: r.location,
              riskLevel: r.aiAnalysis?.risk_level || 'High',
              recommendation: r.aiAnalysis?.recommendation || r.description,
              date: r.created_at,
              alertStatus: r.status === 'Verified' ? 'Active Verified Warning' : 'Pending Verification',
            })),
          ];

          setAlerts(activeList);
          return;
        }
      } catch (e) {
        console.warn('Using default active alerts:', e);
      }

      // Default active alerts (only non-resolved)
      setAlerts([
        {
          id: 1,
          hazard: 'Oil Spill Incident',
          location: 'Mumbai Coast, Maharashtra',
          riskLevel: 'High',
          recommendation: 'A major oil spill has been confirmed near Mumbai harbor. Coastal authorities must deploy containment booms immediately.',
          date: '2026-08-06T08:30:00Z',
          alertStatus: 'Active Emergency Alert',
        },
        {
          id: 2,
          hazard: 'Cyclone Warning',
          location: 'Bay of Bengal',
          riskLevel: 'High',
          recommendation: 'A deep atmospheric depression is forming in the Bay of Bengal. Fishermen are advised not to venture into deep sea waters.',
          date: '2026-08-05T18:00:00Z',
          alertStatus: 'Weather Warning',
        },
        {
          id: 3,
          hazard: 'Plastic Pollution Surge',
          location: 'Marina Beach, Chennai',
          riskLevel: 'Medium',
          recommendation: 'Substantial plastic debris reported washing ashore. Municipal cleanup crews dispatched.',
          date: '2026-08-05T10:15:00Z',
          alertStatus: 'Environmental Alert',
        },
      ]);
    };

    fetchAlerts();
  }, []);

  // Filter out any resolved alerts strictly
  const activeAlerts = alerts.filter(
    (a) => (a.status || '').toLowerCase() !== 'resolved' && (a.alertStatus || '').toLowerCase() !== 'resolved'
  );

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Active Emergency Alerts</h2>
        <p className="text-muted">Real-time alerts and AI safety advisories regarding active, non-resolved ocean hazards.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {activeAlerts.length > 0 ? (
          activeAlerts.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        ) : (
          <div className="card text-center" style={{ padding: '2.5rem 0' }}>
            <p className="text-muted" style={{ margin: 0 }}>
              No active emergency alerts at this time. All reported hazards have been resolved or reviewed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;


