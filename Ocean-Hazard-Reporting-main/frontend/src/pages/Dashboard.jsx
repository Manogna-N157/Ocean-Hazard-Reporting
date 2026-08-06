import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle, Clock, Plus, CheckCheck, XCircle } from 'lucide-react';
import StatisticsCard from '../components/StatisticsCard';
import ReportCard from '../components/ReportCard';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ submitted: 0, verified: 0, pending: 0, resolved: 0, rejected: 0 });
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsRes, reportsRes] = await Promise.all([
          api.get('/dashboard/statistics').catch(() => ({ data: { statistics: {} } })),
          api.get('/reports').catch(() => ({ data: { reports: [] } })),
        ]);

        const fetchedReports = (reportsRes.data?.reports || reportsRes.data?.latestReports || []).map(
          (report) => ({
            ...report,
            type: report.aiAnalysis?.hazard_prediction || report.hazard_type,
            date: report.created_at,
          })
        );

        setRecentReports(fetchedReports);

        const st = statsRes.data?.statistics || {};
        setStats({
          submitted: fetchedReports.length || st.totalReports || 0,
          pending: fetchedReports.filter((r) => r.status === 'Pending').length || st.pendingReports || 0,
          verified: fetchedReports.filter((r) => r.status === 'Verified').length || st.verifiedReports || 0,
          resolved: fetchedReports.filter((r) => r.status === 'Resolved').length || 0,
          rejected: fetchedReports.filter((r) => r.status === 'Rejected').length || 0,
        });
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load dashboard data.');
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Citizen Dashboard</h2>
          <p className="text-muted">Track your submitted ocean hazard reports and monitor live verification and resolution updates.</p>
        </div>
        <Link to="/report-hazard" className="btn btn-primary">
          <Plus size={18} /> Submit New Hazard Report
        </Link>
      </div>

      {/* Feature 6: Report Status Summary Cards */}
      <div className="grid-4 mb-4" style={{ gap: '1rem' }}>
        <StatisticsCard title="Total Submitted" value={stats.submitted} icon={FileText} color="var(--color-primary)" />
        <StatisticsCard title="Pending Review" value={stats.pending} icon={Clock} color="var(--color-warning)" />
        <StatisticsCard title="Verified Reports" value={stats.verified} icon={CheckCircle} color="var(--color-secondary)" />
        <StatisticsCard title="Resolved Reports" value={stats.resolved} icon={CheckCheck} color="var(--color-success)" />
      </div>

      {error && <p style={{ color: 'var(--color-danger)', marginBottom: '1rem' }}>{error}</p>}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>Your Submitted Reports & Statuses</h3>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Live status badges: Pending, Verified, Rejected, Resolved</span>
        </div>

        {/* Card View for all screens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recentReports.length > 0 ? (
            recentReports.map((report) => <ReportCard key={report.id} report={report} />)
          ) : (
            <p className="text-muted text-center" style={{ padding: '2rem 0' }}>
              You haven't submitted any reports yet. Click "Submit New Hazard Report" above to start.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


