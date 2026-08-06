import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Alerts from './pages/Alerts';
import AIAnalysis from './pages/AIAnalysis';
import Analytics from './pages/Analytics';
import AuthorityDashboard from './pages/AuthorityDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Dashboard from './pages/Dashboard';
import HazardMap from './pages/HazardMap';
import Home from './pages/Home';
import Login from './pages/Login';
import MyReports from './pages/MyReports';
import PendingReports from './pages/PendingReports';
import PendingAuthorityApplications from './pages/PendingAuthorityApplications';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ReportHazard from './pages/ReportHazard';
import SocialMediaAnalyzer from './pages/SocialMediaAnalyzer';
import UserManagement from './pages/UserManagement';
import api from './services/api';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const role = currentUser?.role || 'Citizen';

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (token && user) {
      try { setCurrentUser(JSON.parse(user)); setIsAuthenticated(true); }
      catch { localStorage.removeItem('token'); localStorage.removeItem('user'); sessionStorage.removeItem('token'); sessionStorage.removeItem('user'); }
    }
  }, []);

  const handleLogout = async () => {
    try { await api.post('/auth/logout'); }
    catch (error) { console.warn('Server logout could not be completed; clearing this device session.', error); }
    finally {
      localStorage.removeItem('token'); localStorage.removeItem('user');
      sessionStorage.removeItem('token'); sessionStorage.removeItem('user');
      setCurrentUser(null); setIsAuthenticated(false); navigate('/login', { replace: true });
    }
  };

  const Protected = ({ roles, children }) => !isAuthenticated ? <Navigate to="/login" replace /> : roles && !roles.includes(role) ? <Navigate to="/dashboard" replace /> : children;
  const Layout = ({ children }) => <div className="dashboard-layout"><Sidebar role={role} onLogout={handleLogout} /><div className="dashboard-shell"><div className="dashboard-content">{children}</div><footer className="app-footer">OceanGuard · Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics</footer></div></div>;
  const Page = ({ roles, children }) => <Protected roles={roles}><Layout>{children}</Layout></Protected>;
  const dashboard = role === 'Admin' ? <AdminDashboard /> : role === 'Authority' ? <AuthorityDashboard /> : <Dashboard />;

  return <div className="app-container"><Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} user={currentUser} /><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
    <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
    <Route path="/dashboard" element={<Page>{dashboard}</Page>} />
    <Route path="/report-hazard" element={<Page roles={['Citizen']}><ReportHazard /></Page>} />
    <Route path="/my-reports" element={<Page roles={['Citizen']}><MyReports /></Page>} />
    <Route path="/ai-analysis/:reportId" element={<Page roles={['Citizen', 'Authority', 'Admin']}><AIAnalysis /></Page>} />
    <Route path="/reports/:reportId" element={<Page roles={['Citizen', 'Authority', 'Admin']}><AIAnalysis /></Page>} />
    <Route path="/pending-reports" element={<Page roles={['Authority', 'Admin']}><PendingReports /></Page>} />
    <Route path="/alerts" element={<Page roles={['Citizen', 'Authority', 'Admin']}><Alerts /></Page>} />
    <Route path="/map" element={<Page roles={['Citizen', 'Authority', 'Admin']}><HazardMap /></Page>} />
    <Route path="/analytics" element={<Page roles={['Authority', 'Admin']}><Analytics /></Page>} />
    <Route path="/social-media-analyzer" element={<Page roles={['Authority', 'Admin']}><SocialMediaAnalyzer /></Page>} />
    <Route path="/authority-applications" element={<Page roles={['Admin']}><PendingAuthorityApplications /></Page>} />
    <Route path="/user-management" element={<Page roles={['Admin']}><UserManagement /></Page>} />
    <Route path="/system-statistics" element={<Page roles={['Admin']}><AdminDashboard /></Page>} />
    <Route path="/admin" element={<Page roles={['Admin']}><AdminDashboard /></Page>} />
    <Route path="/profile" element={<Page><Profile user={currentUser} /></Page>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></div>;
}

const App = () => <Router><AppContent /></Router>;
export default App;
