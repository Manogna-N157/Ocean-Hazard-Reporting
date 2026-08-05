import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Plus } from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import ReportCard from '../components/ReportCard';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ submitted: 0, verified: 0, pending: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/statistics')
      .then(({ data }) => {
        setStats({ submitted: data.statistics.totalReports, verified: data.statistics.verifiedReports, pending: data.statistics.pendingReports });
        setRecentReports((data.latestReports || []).map((report) => ({ ...report, type: report.hazard_type, date: report.created_at })));
      })
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load dashboard data.'));
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Citizen Dashboard</h2>
        <Link to="/report-hazard" className="btn btn-primary">
          <Plus size={18} /> Submit New Hazard Report
        </Link>
      </div>

      <div className="grid-3 mb-4">
        <StatisticsCard title="Reports Submitted" value={stats.submitted} icon={FileText} color="var(--color-primary)" />
        <StatisticsCard title="Verified Reports" value={stats.verified} icon={CheckCircle} color="var(--color-success)" />
        <StatisticsCard title="Pending Reports" value={stats.pending} icon={Clock} color="var(--color-warning)" />
      </div>

      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <div className="card">
        <h3 className="mb-3">Your Recent Reports</h3>
        
        {/* Table View for larger screens */}
        <div className="table-container" style={{ display: 'none' }} id="desktop-table">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hazard Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map(report => (
                <tr key={report.id}>
                  <td style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{report.type}</td>
                  <td>{report.location}</td>
                  <td>
                    <span className={`badge badge-${report.severity.toLowerCase()}`}>{report.severity}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${report.status.toLowerCase()}`}>{report.status}</span>
                  </td>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Card View for responsive/mobile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentReports.map(report => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
