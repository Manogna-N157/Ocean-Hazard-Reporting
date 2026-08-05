import React from 'react';

const StatisticsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ 
        backgroundColor: `${color}15`, 
        color: color,
        padding: '1rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {Icon && <Icon size={28} />}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: '2rem', color: 'var(--color-text-main)' }}>{value}</h3>
        <p className="text-muted" style={{ margin: 0, fontWeight: '500' }}>{title}</p>
      </div>
    </div>
  );
};

export default StatisticsCard;
