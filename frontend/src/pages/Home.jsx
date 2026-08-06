import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Bell, Users, ArrowRight } from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';

const Home = () => {
  return (
    <div className="main-content">
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem', 
        backgroundColor: 'var(--color-primary)', 
        color: 'white', 
        borderRadius: 'var(--border-radius-lg)',
        marginBottom: '3rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.5rem' }}>
          OceanGuard
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 2.5rem', opacity: 0.9 }}>
          Integrated Platform for Crowdsourced Ocean Hazard Reporting and Social Media Analytics
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/report-hazard" className="btn btn-secondary" style={{ backgroundColor: 'var(--color-secondary)', color: 'white', borderColor: 'var(--color-secondary)' }}>
            Report Hazard <ArrowRight size={18} />
          </Link>
          <Link to="/map" className="btn btn-secondary" style={{ color: 'white', borderColor: 'white' }}>
            View Hazard Map
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="mb-4">
        <h2 className="mb-3 text-center">System Overview</h2>
        <div className="grid-4">
          <StatisticsCard title="Total Reports" value="1,248" icon={AlertCircle} color="var(--color-primary)" />
          <StatisticsCard title="Verified Reports" value="892" icon={CheckCircle} color="var(--color-success)" />
          <StatisticsCard title="Active Alerts" value="14" icon={Bell} color="var(--color-danger)" />
          <StatisticsCard title="Registered Users" value="5,032" icon={Users} color="var(--color-secondary)" />
        </div>
      </div>

      {/* Information Section */}
      <div className="grid-2 mt-4">
        <div className="card">
          <h3>How it Works</h3>
          <ol style={{ paddingLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
            <li className="mb-1"><strong>Observe:</strong> Citizens notice an ocean hazard (e.g., oil spill, plastic pollution).</li>
            <li className="mb-1"><strong>Report:</strong> Submit a detailed report with location, photos, and severity.</li>
            <li className="mb-1"><strong>Verify:</strong> Authorities review and verify the crowdsourced data.</li>
            <li className="mb-1"><strong>Action:</strong> Rapid response teams are dispatched and public alerts are issued.</li>
          </ol>
        </div>
        <div className="card" style={{ backgroundColor: 'var(--color-primary-light)', color: 'white' }}>
          <h3 style={{ color: 'white' }}>Social Media Integration</h3>
          <p style={{ opacity: 0.9, marginBottom: '1rem' }}>
            Our platform continuously analyzes social media feeds using advanced NLP to detect early signs of ocean hazards before they are officially reported.
          </p>
          <Link to="/analytics" className="btn" style={{ backgroundColor: 'white', color: 'var(--color-primary)' }}>
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
