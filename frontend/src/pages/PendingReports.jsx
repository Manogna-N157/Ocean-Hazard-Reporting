import React, { useEffect, useState } from 'react';
import ReportCard from '../components/ReportCard';
import api from '../services/api';

const PendingReports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/reports/operational')
      .then((response) => setReports((response.data.reports || []).filter((report) => report.status === 'Pending')))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load pending reports.'));
  }, []);

  return <div className="main-content">
    <h2>Pending Reports</h2>
    <p className="text-muted mb-3">Hazard reports awaiting operational review and verification.</p>
    {error && <div className="notice notice-error">{error}</div>}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reports.map((report) => <ReportCard key={report.id} report={report} />)}
      {!reports.length && !error && <p className="text-muted">No pending reports at this time.</p>}
    </div>
  </div>;
};

export default PendingReports;
