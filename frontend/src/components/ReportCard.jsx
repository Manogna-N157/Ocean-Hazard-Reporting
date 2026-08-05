import React from 'react';
import { MapPin, Calendar, Activity } from 'lucide-react';

const ReportCard = ({ report }) => {
  const { type, location, severity, status, date } = report;

  const getSeverityBadge = (severity) => {
    const s = severity.toLowerCase();
    if (s === 'high') return <span className="badge badge-high">High</span>;
    if (s === 'medium') return <span className="badge badge-medium">Medium</span>;
    return <span className="badge badge-low">Low</span>;
  };

  const getStatusBadge = (status) => {
    const s = status.toLowerCase();
    if (s === 'verified') return <span className="badge badge-verified">Verified</span>;
    return <span className="badge badge-pending">Pending</span>;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-primary)' }}>{type}</h4>
        {getStatusBadge(status)}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={16} />
          <span>{location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} />
          <span>Severity: {getSeverityBadge(severity)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} />
          <span>{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
