import React, { useEffect, useState } from 'react';
import ReportCard from '../components/ReportCard';
import api from '../services/api';
const MyReports = () => { const [reports, setReports] = useState([]); const [error, setError] = useState(''); useEffect(() => { api.get('/reports').then((r) => setReports(r.data.reports || [])).catch((e) => setError(e.response?.data?.message || 'Unable to load reports.')); }, []); return <div className="main-content"><h2>My Reports</h2><p className="text-muted mb-3">Track the status of every hazard report you submitted.</p>{error && <div className="notice notice-error">{error}</div>}<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>{reports.map((report) => <ReportCard key={report.id} report={report} />)}{!reports.length && !error && <p className="text-muted">You have not submitted any reports yet.</p>}</div></div>; };
export default MyReports;
