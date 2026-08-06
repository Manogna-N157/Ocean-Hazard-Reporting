import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, BrainCircuit, CheckCircle2, AlertTriangle, AlertCircle, Image as ImageIcon } from 'lucide-react';

const API_ORIGIN = 'http://localhost:5000';

const ReportCard = ({ report }) => {
  if (!report) return null;

  const { id, location, description, status, created_at, date, image_url, aiAnalysis } = report;

  const displayDate = created_at || date;
  const imageUrl = image_url ? (image_url.startsWith('http') ? image_url : `${API_ORIGIN}${image_url}`) : null;

  const hazardPrediction = aiAnalysis?.hazard_prediction || report.hazard_type || 'Unclassified';
  const confidenceScore = aiAnalysis?.confidence_score ? `${Math.round(Number(aiAnalysis.confidence_score))}%` : 'Pending';
  const riskLevel = aiAnalysis?.risk_level || 'Pending';
  const recommendation = aiAnalysis?.recommendation || 'Awaiting AI analysis...';

  const getRiskBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'high') {
      return (
        <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertTriangle size={13} /> High Risk
        </span>
      );
    }
    if (l === 'medium') {
      return (
        <span className="badge badge-medium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={13} /> Medium Risk
        </span>
      );
    }
    if (l === 'low') {
      return (
        <span className="badge badge-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <CheckCircle2 size={13} /> Low Risk
        </span>
      );
    }
    return <span className="badge badge-pending">AI Analysis Pending</span>;
  };

  const getStatusBadge = (st) => {
    const s = (st || '').toLowerCase();
    if (s === 'resolved') return <span className="badge badge-low" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid var(--color-success)' }}>Resolved</span>;
    if (s === 'verified') return <span className="badge badge-verified">Verified</span>;
    if (s === 'rejected') return <span className="badge badge-high" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Rejected</span>;
    return <span className="badge badge-pending">Pending Review</span>;
  };

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
      {/* Header with Hazard Title and Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--color-primary)' }}>{hazardPrediction}</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            <MapPin size={14} /> {location}
          </div>
        </div>
        <div>{getStatusBadge(status)}</div>
      </div>

      {/* Image and Main Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: imageUrl ? '120px 1fr' : '1fr', gap: '1rem', alignItems: 'flex-start' }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded hazard evidence"
            style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee' }}
          />
        ) : (
          <div style={{ width: '120px', height: '100px', backgroundColor: '#f1f5f9', borderRadius: 'var(--border-radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            <ImageIcon size={24} />
            <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>No Image</span>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
            <strong>Description:</strong> {description}
          </p>

          {/* AI Assessment Info */}
          <div style={{ backgroundColor: '#f8fafc', padding: '0.6rem 0.8rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-primary)', fontWeight: '600' }}>
                <BrainCircuit size={16} />
                <span>AI Hazard: {hazardPrediction}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Confidence: <strong>{confidenceScore}</strong></span>
                {getRiskBadge(riskLevel)}
              </div>
            </div>

            {recommendation && (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>
                <strong>AI Recommendation:</strong> {recommendation}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with Date and Link to Details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', borderTop: '1px solid #e1e9ee', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Calendar size={14} />
          <span>{displayDate ? new Date(displayDate).toLocaleDateString() : 'N/A'}</span>
        </div>

        <Link to={`/ai-analysis/${id}`} style={{ fontWeight: '600', color: 'var(--color-primary)', fontSize: '0.85rem' }}>
          View Full AI Analysis & Details &rarr;
        </Link>
      </div>
    </div>
  );
};

export default ReportCard;

