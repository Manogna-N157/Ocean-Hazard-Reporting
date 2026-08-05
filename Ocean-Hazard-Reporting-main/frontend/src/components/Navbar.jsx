import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Waves, LogOut, User } from 'lucide-react';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <nav style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-md)' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>
        <Waves size={28} color="var(--color-secondary)" />
        OceanGuard
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white' }}>Home</Link>
        <Link to="/map" style={{ color: 'white' }}>Hazard Map</Link>
        <Link to="/alerts" style={{ color: 'white' }}>Alerts</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" style={{ color: 'white' }}>Dashboard</Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ backgroundColor: 'var(--color-secondary)' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
