import React, { useEffect, useState } from 'react';
import StatisticsCard from '../components/StatisticsCard';
import { Shield, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, pendingReports: 0, verifiedReports: 0, rejectedReports: 0 });
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [reportResponse, dashboardResponse] = await Promise.all([api.get('/admin/reports'), api.get('/dashboard/statistics')]);
      setReports(reportResponse.data.reports.map((report) => ({ ...report, user: report.user?.name || 'Unknown', type: report.hazard_type, date: report.created_at })));
      const values = dashboardResponse.data.statistics;
      setStats({ totalReports: values.totalReports || values.reportsAssigned || 0, pendingReports: values.pendingReports || 0, verifiedReports: values.verifiedReports || values.reportsVerified || 0, rejectedReports: values.rejectedReports || 0 });
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load report queue.'); }
  };

  useEffect(() => { loadData(); }, []);

  const handleAction = (id, newStatus) => {
    const action = newStatus === 'Verified' ? 'verify' : 'reject';
    api.put(`/admin/reports/${id}/${action}`)
      .then(loadData)
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to update report.'));
  };

  const pendingCount = stats.pendingReports;
  const verifiedCount = stats.verifiedReports;
  const rejectedCount = stats.rejectedReports;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Authority / Admin Panel</h2>
        <p className="text-muted">Review, verify, and manage crowdsourced hazard reports.</p>
      </div>

      <div className="grid-4 mb-4">
        <StatisticsCard title="Total Reports" value={stats.totalReports} icon={Shield} color="var(--color-primary)" />
        <StatisticsCard title="Pending Review" value={pendingCount} icon={Clock} color="var(--color-warning)" />
        <StatisticsCard title="Verified Reports" value={verifiedCount} icon={CheckCircle} color="var(--color-success)" />
        <StatisticsCard title="Rejected" value={rejectedCount} icon={XCircle} color="var(--color-danger)" />
      </div>

      {error && <p style={{ color: 'var(--color-danger)' }}>{error}</p>}

      <div className="card">
        <h3 className="mb-3">Report Queue</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Hazard Type</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.user}</td>
                  <td style={{ fontWeight: '500', color: 'var(--color-primary)' }}>{report.type}</td>
                  <td>{report.location}</td>
                  <td>
                    <span className={`badge badge-${report.severity.toLowerCase()}`}>{report.severity}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${report.status.toLowerCase()}`}>{report.status}</span>
                  </td>
                  <td>{new Date(report.date).toLocaleDateString()}</td>
                  <td>
                    {report.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => handleAction(report.id, 'Verified')}
                          className="btn" 
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}
                        >
                          Verify
                        </button>
                        <button 
                          onClick={() => handleAction(report.id, 'Rejected')}
                          className="btn" 
                          style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' }}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
