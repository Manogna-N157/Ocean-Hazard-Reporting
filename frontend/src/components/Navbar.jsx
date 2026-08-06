import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, UserRound, Waves } from 'lucide-react';

const Navbar = ({ isAuthenticated, onLogout, user }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => { if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  const logout = () => { setOpen(false); onLogout(); };
  return <nav className="navbar">
    <Link to="/" className="brand"><Waves size={28} color="var(--color-secondary)" />OceanGuard</Link>
    <div className="nav-links">
      <Link to="/">Home</Link>
      {isAuthenticated ? <>
        <Link to="/dashboard">Dashboard</Link>
        <div className="user-menu" ref={menuRef}>
          <button className="user-menu-trigger" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-haspopup="menu">
            <UserRound size={17} /> {user?.role || 'User'} <ChevronDown size={15} style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
          </button>
          {open && <div className="user-menu-dropdown" role="menu">
            <Link to="/profile" role="menuitem" onClick={() => setOpen(false)}><UserRound size={16} /> Profile</Link>
            <button role="menuitem" onClick={logout}><LogOut size={16} /> Logout</button>
          </div>}
        </div>
      </> : <><Link to="/login" className="btn btn-secondary nav-logout">Login</Link><Link to="/register" className="btn btn-primary">Register</Link></>}
    </div>
  </nav>;
};
export default Navbar;
