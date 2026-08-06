import React from 'react';
import { BrainCircuit, ShieldAlert, Lightbulb, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

const AIResultCard = ({ analysis }) => {
  if (!analysis) return null;

  const hazardType = analysis.hazardType || analysis.hazard_prediction || 'Unknown Hazard';
  const confidence = analysis.confidenceScore ?? analysis.confidence_score ?? 0;
  const riskLevel = analysis.riskLevel || analysis.risk_level || 'Medium';
  const recommendation = analysis.recommendation || 'No recommendation available.';
  const explanation = analysis.explanation;

  const isHigh = riskLevel.toLowerCase() === 'high';
  const isMedium = riskLevel.toLowerCase() === 'medium';

  const getRiskBadge = (level) => {
    const l = (level || '').toLowerCase();
    if (l === 'high') {
      return (
        <span className="badge badge-high" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertTriangle size={14} /> High
        </span>
      );
    }
    if (l === 'medium') {
      return (
        <span className="badge badge-medium" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={14} /> Medium
        </span>
      );
    }
    return (
      <span className="badge badge-low" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
        <CheckCircle2 size={14} /> Low
      </span>
    );
  };

  const borderColor = isHigh ? 'var(--color-danger)' : isMedium ? 'var(--color-warning)' : 'var(--color-success)';

  return (
    <div className="card" style={{ borderLeft: `4px solid ${borderColor}`, boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #e1e9ee', paddingBottom: '0.75rem' }}>
        <BrainCircuit color="var(--color-primary)" size={26} />
        <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>AI Analysis</h3>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.25rem', gap: '1rem' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)' }}>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Detected Hazard</p>
          <strong style={{ fontSize: '1.1rem', color: 'var(--color-text-main)' }}>{hazardType}</strong>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)' }}>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>Confidence Score</p>
          <strong style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{Math.round(Number(confidence))}%</strong>
        </div>

        <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)' }}>
          <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.25rem' }}>AI Risk Level</p>
          <div>{getRiskBadge(riskLevel)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', backgroundColor: 'var(--color-warning-light)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem' }}>
        <Lightbulb size={22} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <div>
          <strong style={{ color: 'var(--color-text-main)' }}>Recommendation</strong>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-main)', fontSize: '0.95rem' }}>{recommendation}</p>
        </div>
      </div>

      {explanation && (
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
          <strong>AI Analysis Evidence:</strong> {explanation}
        </div>
      )}

      <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <ShieldAlert size={14} /> AI assessment automatically generated from evidence image.
      </p>
    </div>
  );
};

export default AIResultCard;
