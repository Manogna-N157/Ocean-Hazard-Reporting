import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ReportHazard from './pages/ReportHazard';
import HazardMap from './pages/HazardMap';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const userRole = currentUser?.role || 'Citizen';

  // Check auth status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) { setCurrentUser(JSON.parse(storedUser)); setIsAuthenticated(true); }
    }
  }, []);

  // Protected Route wrapper
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    // Simple role check for prototype
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  // Layout with Sidebar for dashboard routes
  const DashboardLayout = ({ children }) => (
    <div className="dashboard-layout">
      <Sidebar role={userRole} />
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );

  return (
    <Router>
      <div className="app-container">
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
          <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} setCurrentUser={setCurrentUser} />} />
          <Route path="/map" element={<div className="dashboard-content"><HazardMap /></div>} />
          <Route path="/alerts" element={<div className="dashboard-content"><Alerts /></div>} />
          <Route path="/analytics" element={<div className="dashboard-content"><Analytics /></div>} />

          {/* Protected Routes - Citizen/Authority */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['Citizen']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/report-hazard" 
            element={
              <ProtectedRoute allowedRoles={['Citizen']}>
                <DashboardLayout>
                  <ReportHazard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Protected Routes - Admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['Admin', 'Authority']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
