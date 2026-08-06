import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Map, Bell, BarChart2, Shield } from 'lucide-react';

const Sidebar = ({ role }) => {
  const linkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--border-radius-sm)',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
    backgroundColor: isActive ? 'rgba(0, 90, 141, 0.05)' : 'transparent',
    fontWeight: isActive ? '600' : '500',
    marginBottom: '0.5rem'
  });

  return (
    <aside style={{ width: '250px', backgroundColor: 'var(--color-surface)', borderRight: '1px solid #e1e9ee', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div className="mb-4">
        <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</h4>
      </div>
      
      {role === 'Admin' ? (
        <>
          <NavLink to="/admin" style={linkStyle} end>
            <Shield size={20} /> Admin Dashboard
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/dashboard" style={linkStyle} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/report-hazard" style={linkStyle}>
            <FileText size={20} /> Report Hazard
          </NavLink>
        </>
      )}

      <div className="mt-4 mb-4">
        <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Public</h4>
      </div>
      
      <NavLink to="/map" style={linkStyle}>
        <Map size={20} /> Hazard Map
      </NavLink>
      <NavLink to="/alerts" style={linkStyle}>
        <Bell size={20} /> Alerts
      </NavLink>
      <NavLink to="/analytics" style={linkStyle}>
        <BarChart2 size={20} /> Analytics
      </NavLink>

    </aside>
  );
};

export default Sidebar;
