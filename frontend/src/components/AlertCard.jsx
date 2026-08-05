import React from 'react';
import { AlertTriangle, MapPin, Clock } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const { title, type, location, severity, description, date } = alert;

  const isHighSeverity = severity.toLowerCase() === 'high';

  return (
    <div className="card" style={{ 
      borderLeft: `4px solid ${isHighSeverity ? 'var(--color-danger)' : 'var(--color-warning)'}`,
      backgroundColor: isHighSeverity ? 'var(--color-danger-light)' : 'white'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ color: isHighSeverity ? 'var(--color-danger)' : 'var(--color-warning)', marginTop: '0.2rem' }}>
          <AlertTriangle size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 style={{ margin: 0, color: isHighSeverity ? 'var(--color-danger)' : 'var(--color-text-main)', fontSize: '1.2rem' }}>
              {title}
            </h3>
            <span className={`badge ${isHighSeverity ? 'badge-high' : 'badge-medium'}`}>
              {severity} Severity
            </span>
          </div>
          
          <p style={{ margin: '0.5rem 0', color: 'var(--color-text-muted)' }}>{description}</p>
          
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} /> {location}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={14} /> {type}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Clock size={14} /> {new Date(date).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
