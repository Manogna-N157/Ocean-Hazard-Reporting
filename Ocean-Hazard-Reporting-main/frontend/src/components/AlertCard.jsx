import React from 'react';
import { AlertTriangle, MapPin, Clock, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

const AlertCard = ({ alert }) => {
  if (!alert) return null;

  const { title, hazard, type, location, riskLevel, risk_level, recommendation, description, date, status, alertStatus } = alert;

  const hazardName = hazard || type || title || 'Ocean Hazard';
  const risk = (riskLevel || risk_level || 'Medium').toLowerCase();
  const currentStatus = alertStatus || status || 'Active Alert';

  const isHigh = risk === 'high';
  const isMedium = risk === 'medium';

  const getRiskBadge = (r) => {
    if (r === 'high') {
      return (
        <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertTriangle size={13} /> High Risk
        </span>
      );
    }
    if (r === 'medium') {
      return (
        <span className="badge badge-medium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={13} /> Medium Risk
        </span>
      );
    }
    return (
      <span className="badge badge-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <CheckCircle2 size={13} /> Low Risk
      </span>
    );
  };

  const borderColor = isHigh ? 'var(--color-danger)' : isMedium ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${borderColor}`,
        backgroundColor: isHigh ? 'var(--color-danger-light)' : 'white',
      }}
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ color: borderColor, marginTop: '0.2rem' }}>
          <ShieldAlert size={26} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: isHigh ? 'var(--color-danger)' : 'var(--color-text-main)', fontSize: '1.2rem' }}>
              {hazardName}
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {getRiskBadge(risk)}
              <span className="badge badge-verified">{currentStatus}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
            <MapPin size={14} /> <strong>Location:</strong> {location}
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee', marginTop: '0.75rem' }}>
            <strong style={{ fontSize: '0.85rem', color: 'var(--color-primary)' }}>AI Safety Recommendation:</strong>
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-main)', fontSize: '0.92rem' }}>
              {recommendation || description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} /> Issued: {new Date(date).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;

