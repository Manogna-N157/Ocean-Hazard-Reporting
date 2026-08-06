import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MapPin, Compass, FileText, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import AIResultCard from '../components/AIResultCard';
import api from '../services/api';

const API_ORIGIN = 'http://localhost:5000';

const AIAnalysis = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const runAnalysis = async (currentReport) => {
    setLoading(true);
    setError('');
    try {
      const payload = new FormData();
      payload.append('report_id', currentReport.id);
      const response = await api.post('/ai/analyze', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysis(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to analyze this image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api
      .get(`/reports/${reportId}`)
      .then(({ data }) => {
        setReport(data.report);
        if (data.report.aiAnalysis) {
          setAnalysis(data.report.aiAnalysis);
          setLoading(false);
        } else if (data.report.image_url) {
          runAnalysis(data.report);
        } else {
          setLoading(false);
        }
      })
      .catch((requestError) => {
        setError(requestError.response?.data?.message || 'Unable to load the report details.');
        setLoading(false);
      });
  }, [reportId]);

  const getStatusBadge = (st) => {
    const s = (st || '').toLowerCase();
    if (s === 'verified') return <span className="badge badge-verified">Verified Report</span>;
    if (s === 'rejected') return <span className="badge badge-high" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Rejected Report</span>;
    return <span className="badge badge-pending">Pending Verification</span>;
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Report Details & AI Diagnostic</h2>
          <p className="text-muted">Detailed breakdown of the ocean hazard report, location telemetry, and AI diagnosis.</p>
        </div>
        {report && <div>{getStatusBadge(report.status)}</div>}
      </div>

      {error && <div className="card" style={{ color: 'var(--color-danger)', marginBottom: '1rem', backgroundColor: 'var(--color-danger-light)' }}>{error}</div>}

      {/* Main Report Details Overview Card */}
      {report && (
        <div className="card mb-4" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3>Incident Telemetry & Evidence</h3>

          {/* Original Uploaded Image */}
          {report.image_url ? (
            <div>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: '600' }}>Original Image Evidence:</p>
              <img
                src={report.image_url.startsWith('http') ? report.image_url : `${API_ORIGIN}${report.image_url}`}
                alt="Original ocean hazard evidence"
                style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: 'var(--border-radius-md)', border: '1px solid #e1e9ee' }}
              />
            </div>
          ) : (
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: 'var(--border-radius-sm)', textAlign: 'center', color: '#94a3b8' }}>
              No image evidence attached to this report.
            </div>
          )}

          {/* Location & GPS Grid */}
          <div className="grid-3" style={{ gap: '1rem', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.2rem' }}>
                <MapPin size={16} /> Location
              </div>
              <span style={{ color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{report.location}</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.2rem' }}>
                <Compass size={16} /> Latitude
              </div>
              <span style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', fontFamily: 'monospace' }}>{report.latitude}</span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-primary)', fontWeight: '600', marginBottom: '0.2rem' }}>
                <Compass size={16} /> Longitude
              </div>
              <span style={{ color: 'var(--color-text-main)', fontSize: '0.95rem', fontFamily: 'monospace' }}>{report.longitude}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '0.4rem' }}>
              <FileText size={16} /> Description
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', backgroundColor: '#ffffff', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee' }}>
              {report.description}
            </p>
          </div>
        </div>
      )}

      {/* AI Analysis Section */}
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem' }}>
          <Loader2 size={36} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite', marginBottom: '0.75rem' }} />
          <h4 style={{ color: 'var(--color-primary)', margin: 0 }}>Analyzing image using AI...</h4>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        analysis && <AIResultCard analysis={analysis} />
      )}

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <Link to="/dashboard" className="btn btn-secondary">Back to Dashboard</Link>
        {report?.image_url && (
          <button onClick={() => runAnalysis(report)} className="btn btn-primary" disabled={loading}>
            Re-run AI Analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;

