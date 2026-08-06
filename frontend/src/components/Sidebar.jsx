import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart2, Bell, BrainCircuit, FileText, LayoutDashboard, LogOut, Map, Shield, UserCog, UserRound, Users } from 'lucide-react';

const Sidebar = ({ role, onLogout }) => {
  const linkStyle = ({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)', color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)', backgroundColor: isActive ? 'rgba(0, 90, 141, 0.05)' : 'transparent', fontWeight: isActive ? 600 : 500, marginBottom: '0.35rem' });
  const LinkItem = ({ to, icon: Icon, children }) => <NavLink to={to} style={linkStyle}><Icon size={19} />{children}</NavLink>;
  return <aside className="sidebar"><h4 className="sidebar-label">Menu</h4>
    {role === 'Citizen' && <><LinkItem to="/dashboard" icon={LayoutDashboard}>Dashboard</LinkItem><LinkItem to="/report-hazard" icon={FileText}>Report Hazard</LinkItem><LinkItem to="/my-reports" icon={FileText}>My Reports</LinkItem><LinkItem to="/map" icon={Map}>Ocean Hazard Map</LinkItem><LinkItem to="/alerts" icon={Bell}>Alerts</LinkItem></>}
    {role === 'Authority' && <><LinkItem to="/dashboard" icon={LayoutDashboard}>Dashboard</LinkItem><LinkItem to="/pending-reports" icon={FileText}>Pending Reports</LinkItem><LinkItem to="/alerts" icon={Bell}>Alerts</LinkItem><LinkItem to="/map" icon={Map}>Ocean Hazard Map</LinkItem><LinkItem to="/social-media-analyzer" icon={BrainCircuit}>Social Media Analyzer</LinkItem></>}
    {role === 'Admin' && <><LinkItem to="/dashboard" icon={Shield}>Dashboard</LinkItem><LinkItem to="/pending-reports" icon={FileText}>Pending Reports</LinkItem><LinkItem to="/alerts" icon={Bell}>Alerts</LinkItem><LinkItem to="/map" icon={Map}>Ocean Hazard Map</LinkItem><LinkItem to="/social-media-analyzer" icon={BrainCircuit}>Social Media Analyzer</LinkItem><LinkItem to="/authority-applications" icon={Users}>Authority Applications</LinkItem><LinkItem to="/user-management" icon={UserCog}>User Management</LinkItem><LinkItem to="/system-statistics" icon={BarChart2}>System Statistics</LinkItem></>}
    <div className="sidebar-spacer" /><LinkItem to="/profile" icon={UserRound}>Profile</LinkItem><button type="button" className="sidebar-logout" onClick={onLogout}><LogOut size={19} />Logout</button>
  </aside>;
};
export default Sidebar;
