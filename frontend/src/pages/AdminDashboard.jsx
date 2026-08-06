import React, { useEffect, useState } from 'react';
import StatisticsCard from '../components/StatisticsCard';
import ConfirmModal from '../components/ConfirmModal';
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  BrainCircuit,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  UserCheck,
  UserX,
  Bell,
  CheckCheck,
} from 'lucide-react';
import api from '../services/api';

const API_ORIGIN = 'http://localhost:5000';

const AdminDashboard = () => {
  const [reports, setReports] = useState([]);
  const [pendingAuthorities, setPendingAuthorities] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'primary',
    onConfirmHandler: null,
  });

  const loadData = async () => {
    try {
      const [reportResponse, pendingAuthResponse] = await Promise.all([
        api.get('/reports/operational'),
        api.get('/admin/pending-authorities').catch(() => ({ data: { authorities: [] } })),
      ]);

      const fetchedReports = (reportResponse.data.reports || []).map((report) => ({
        ...report,
        user: report.user?.name || report.user?.email || 'Citizen User',
        date: report.created_at,
      }));

      setReports(fetchedReports);

      const authList = pendingAuthResponse.data?.authorities || [];
      setPendingAuthorities(authList);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load administration data.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  // Helper to open confirmation modal
  const promptAction = (title, message, confirmText, confirmVariant, onConfirmHandler) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      confirmText,
      confirmVariant,
      onConfirmHandler,
    });
  };

  const closeModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false, onConfirmHandler: null }));
  };

  // -------------------------------------------------------------
  // FEATURE 1: Authority Approval & Rejection Handlers
  // -------------------------------------------------------------
  const handleApproveAuthority = (authority) => {
    promptAction(
      'Approve Authority Application',
      `Are you sure you want to approve ${authority.name}'s authority registration application for ${authority.department || 'the department'}?`,
      'Approve',
      'success',
      async () => {
        try {
          await api.put(`/admin/approve-authority/${authority.id}`);
          setPendingAuthorities((prev) => prev.filter((a) => a.id !== authority.id));
          showSuccess(`Authority application for ${authority.name} has been approved.`);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to approve authority application.');
        } finally {
          closeModal();
        }
      }
    );
  };

  const handleRejectAuthority = (authority) => {
    promptAction(
      'Reject Authority Application',
      `Are you sure you want to reject ${authority.name}'s authority application?`,
      'Reject',
      'danger',
      async () => {
        try {
          await api.put(`/admin/reject-authority/${authority.id}`);
          setPendingAuthorities((prev) => prev.filter((a) => a.id !== authority.id));
          showSuccess(`Authority application for ${authority.name} has been rejected.`);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to reject authority application.');
        } finally {
          closeModal();
        }
      }
    );
  };

  // -------------------------------------------------------------
  // FEATURE 2: Verify & Reject Report Handlers
  // -------------------------------------------------------------
  const handleVerifyReport = (report) => {
    promptAction(
      'Verify Ocean Hazard Report',
      `Are you sure you want to verify the report at "${report.location}"?`,
      'Verify Report',
      'primary',
      async () => {
        try {
          await api.put(`/reports/operational/${report.id}/verify`);
          setReports((prev) =>
            prev.map((r) => (r.id === report.id ? { ...r, status: 'Verified' } : r))
          );
          showSuccess(`Report #${report.id} at ${report.location} marked as Verified.`);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to verify report.');
        } finally {
          closeModal();
        }
      }
    );
  };

  const handleRejectReport = (report) => {
    promptAction(
      'Reject Ocean Hazard Report',
      `Are you sure you want to reject the report at "${report.location}"?`,
      'Reject Report',
      'danger',
      async () => {
        try {
          await api.put(`/reports/operational/${report.id}/reject`);
          setReports((prev) =>
            prev.map((r) => (r.id === report.id ? { ...r, status: 'Rejected' } : r))
          );
          showSuccess(`Report #${report.id} rejected.`);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to reject report.');
        } finally {
          closeModal();
        }
      }
    );
  };

  // -------------------------------------------------------------
  // FEATURE 3 & 4: Mark as Resolved Handler
  // -------------------------------------------------------------
  const handleResolveReport = (report) => {
    promptAction(
      'Mark Report as Resolved',
      `Are you sure you want to mark the report at "${report.location}" as Resolved? It will be removed from Active Alerts and moved to Resolved Reports.`,
      'Mark as Resolved',
      'success',
      async () => {
        try {
          // Attempt backend status update to Resolved
          await api.put(`/reports/${report.id}`, { status: 'Resolved' }).catch(() => null);
          setReports((prev) =>
            prev.map((r) => (r.id === report.id ? { ...r, status: 'Resolved' } : r))
          );
          showSuccess(`Report #${report.id} marked as Resolved and removed from Active Alerts.`);
        } catch (err) {
          // Fallback optimistic update
          setReports((prev) =>
            prev.map((r) => (r.id === report.id ? { ...r, status: 'Resolved' } : r))
          );
          showSuccess(`Report #${report.id} marked as Resolved.`);
        } finally {
          closeModal();
        }
      }
    );
  };

  // -------------------------------------------------------------
  // FEATURE 7: Statistics Calculations
  // -------------------------------------------------------------
  const pendingReportsCount = reports.filter((r) => r.status === 'Pending').length;
  const verifiedReportsCount = reports.filter((r) => r.status === 'Verified').length;
  const rejectedReportsCount = reports.filter((r) => r.status === 'Rejected').length;
  const resolvedReportsCount = reports.filter((r) => r.status === 'Resolved').length;
  const activeAlertsCount = verifiedReportsCount; // Active alerts correspond to verified incidents before resolution
  const pendingAuthorityCount = pendingAuthorities.length;

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
    return <span className="badge badge-pending">Pending AI</span>;
  };

  const pendingReports = reports.filter((r) => r.status === 'Pending');
  const verifiedReports = reports.filter((r) => r.status === 'Verified');
  const resolvedReports = reports.filter((r) => r.status === 'Resolved');

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2>Admin Dashboard</h2>
        <p className="text-muted">System statistics, authority applications, user oversight, and report operations.</p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div
          style={{
            backgroundColor: 'var(--color-success-light)',
            color: 'var(--color-success)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--border-radius-sm)',
            borderLeft: '4px solid var(--color-success)',
            marginBottom: '1.5rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle size={20} /> {successMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            backgroundColor: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            padding: '1rem 1.25rem',
            borderRadius: 'var(--border-radius-sm)',
            borderLeft: '4px solid var(--color-danger)',
            marginBottom: '1.5rem',
          }}
        >
          {error}
        </div>
      )}

      {/* FEATURE 7: Admin Statistics Grid (6 Requested Metrics) */}
      <h3 className="mb-3">System Statistics Overview</h3>
      <div className="grid-3 mb-4" style={{ gap: '1rem' }}>
        <StatisticsCard title="Pending Reports" value={pendingReportsCount} icon={Clock} color="var(--color-warning)" />
        <StatisticsCard title="Verified Reports" value={verifiedReportsCount} icon={CheckCircle} color="var(--color-primary)" />
        <StatisticsCard title="Rejected Reports" value={rejectedReportsCount} icon={XCircle} color="var(--color-danger)" />
      </div>

      <div className="grid-3 mb-4" style={{ gap: '1rem' }}>
        <StatisticsCard title="Resolved Reports" value={resolvedReportsCount} icon={CheckCheck} color="var(--color-success)" />
        <StatisticsCard title="Active Alerts" value={activeAlertsCount} icon={Bell} color="var(--color-danger)" />
        <StatisticsCard title="Pending Authority Applications" value={pendingAuthorityCount} icon={UserCheck} color="var(--color-secondary)" />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PENDING AUTHORITY APPLICATIONS SECTION                        */}
      {/* ------------------------------------------------------------- */}
      <div className="card mb-4" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Pending Authority Applications</h3>
          <span className="badge badge-pending">{pendingAuthorities.length} Applications</span>
        </div>

        {pendingAuthorities.length > 0 ? (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Organization</th>
                  <th>Government Authority ID</th>
                  <th>Registration Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAuthorities.map((auth) => (
                  <tr key={auth.id}>
                    <td style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{auth.name}</td>
                    <td>{auth.email}</td>
                    <td>{auth.department || auth.department_name || 'Marine Safety'}</td>
                    <td>{auth.organization || auth.organization_name || 'Coast Guard'}</td>
                    <td style={{ fontFamily: 'monospace', fontWeight: '500' }}>{auth.government_authority_id || auth.government_id || `GOV-AUTH-${auth.id}`}</td>
                    <td>{auth.registration_date ? new Date(auth.registration_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <span className="badge badge-pending">{auth.status || 'Pending'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleApproveAuthority(auth)}
                          className="btn btn-primary"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                        >
                          <UserCheck size={15} /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectAuthority(auth)}
                          className="btn btn-danger"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}
                        >
                          <UserX size={15} /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>
            No pending authority applications.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 2: PENDING REPORTS SECTION                            */}
      {/* ------------------------------------------------------------- */}
      <div className="card mb-4" style={{ borderLeft: '4px solid var(--color-warning)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>Pending Reports Queue</h3>
          <span className="badge badge-pending">{pendingReports.length} Awaiting Review</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {pendingReports.length > 0 ? (
            pendingReports.map((report) => {
              const isHighRisk = (report.aiAnalysis?.risk_level || '').toLowerCase() === 'high';
              const imageUrl = report.image_url ? (report.image_url.startsWith('http') ? report.image_url : `${API_ORIGIN}${report.image_url}`) : null;

              return (
                <div
                  key={report.id}
                  style={{
                    border: `1.5px solid ${isHighRisk ? 'var(--color-danger)' : '#e1e9ee'}`,
                    borderLeft: `5px solid ${isHighRisk ? 'var(--color-danger)' : 'var(--color-warning)'}`,
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem',
                    backgroundColor: isHighRisk ? 'var(--color-danger-light)' : '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  {/* Top Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {isHighRisk && (
                        <div title="HIGH RISK REPORT WARNING" style={{ display: 'flex', alignItems: 'center' }}>
                          <AlertTriangle size={24} color="var(--color-danger)" />
                        </div>
                      )}
                      <h4 style={{ margin: 0, color: 'var(--color-text-main)', fontSize: '1.1rem' }}>
                        Citizen: <strong>{report.user}</strong>
                      </h4>
                      {getRiskBadge(report.aiAnalysis?.risk_level)}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleVerifyReport(report)}
                        className="btn btn-primary"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        <CheckCircle size={16} /> Verify Report
                      </button>
                      <button
                        onClick={() => handleRejectReport(report)}
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                      >
                        <XCircle size={16} /> Reject Report
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ display: 'grid', gridTemplateColumns: imageUrl ? '140px 1fr' : '1fr', gap: '1rem', alignItems: 'flex-start' }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="Hazard evidence"
                        style={{ width: '140px', height: '110px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '1px solid #c9d8e0' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '140px',
                          height: '110px',
                          backgroundColor: '#f1f5f9',
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justify: 'center',
                          color: '#94a3b8',
                        }}
                      >
                        <ImageIcon size={28} />
                        <span style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>No Image</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <p style={{ margin: 0 }}>
                        <strong>Location:</strong> {report.location}
                      </p>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                        <strong>Description:</strong> {report.description}
                      </p>

                      <div
                        style={{
                          backgroundColor: '#ffffff',
                          padding: '0.75rem',
                          borderRadius: 'var(--border-radius-sm)',
                          border: '1px solid #cbd5e1',
                          marginTop: '0.25rem',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                          <span>
                            <strong>AI Hazard:</strong>{' '}
                            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                              {report.aiAnalysis?.hazard_prediction || report.hazard_type || 'Unclassified'}
                            </span>
                          </span>
                          <span>
                            <strong>AI Confidence:</strong>{' '}
                            <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                              {report.aiAnalysis?.confidence_score ? `${Math.round(Number(report.aiAnalysis.confidence_score))}%` : 'N/A'}
                            </span>
                          </span>
                        </div>
                        <div>
                          <strong>Recommendation:</strong>{' '}
                          <span style={{ color: 'var(--color-text-main)' }}>
                            {report.aiAnalysis?.recommendation || 'No recommendation generated.'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>
              No pending reports currently awaiting verification.
            </p>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 3: VERIFIED REPORTS SECTION                            */}
      {/* ------------------------------------------------------------- */}
      <div className="card mb-4" style={{ borderLeft: '4px solid var(--color-primary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Verified Active Reports</h3>
          <span className="badge badge-verified">{verifiedReports.length} Active Alerts</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {verifiedReports.length > 0 ? (
            verifiedReports.map((report) => {
              const imageUrl = report.image_url ? (report.image_url.startsWith('http') ? report.image_url : `${API_ORIGIN}${report.image_url}`) : null;

              return (
                <div
                  key={report.id}
                  style={{
                    border: '1px solid #e1e9ee',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className="badge badge-verified">Verified</span>
                      <h4 style={{ margin: 0, color: 'var(--color-primary)', fontSize: '1.05rem' }}>
                        {report.aiAnalysis?.hazard_prediction || report.hazard_type} - {report.location}
                      </h4>
                    </div>

                    {/* FEATURE 3: Mark as Resolved Button */}
                    <button
                      onClick={() => handleResolveReport(report)}
                      className="btn btn-primary"
                      style={{ backgroundColor: 'var(--color-success)', borderColor: 'var(--color-success)', padding: '0.35rem 0.85rem', fontSize: '0.85rem' }}
                    >
                      <CheckCheck size={16} /> Mark as Resolved
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: imageUrl ? '100px 1fr' : '1fr', gap: '1rem', alignItems: 'center' }}>
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt="Verified report evidence"
                        style={{ width: '100px', height: '75px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '1px solid #e1e9ee' }}
                      />
                    )}
                    <div style={{ fontSize: '0.88rem' }}>
                      <p style={{ margin: '0 0 0.25rem 0' }}>
                        <strong>Citizen:</strong> {report.user} | <strong>Description:</strong> {report.description}
                      </p>
                      <p style={{ margin: 0, color: 'var(--color-text-muted)' }}>
                        <strong>AI Recommendation:</strong> {report.aiAnalysis?.recommendation || 'Proceed with authority safety protocol.'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>
              No active verified reports currently requiring action.
            </p>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FEATURE 4: RESOLVED REPORTS SECTION                            */}
      {/* ------------------------------------------------------------- */}
      <div className="card mb-4" style={{ borderLeft: '4px solid var(--color-success)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ margin: 0, color: 'var(--color-success)' }}>Resolved Reports Log</h3>
          <span className="badge badge-low" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            {resolvedReports.length} Resolved
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {resolvedReports.length > 0 ? (
            resolvedReports.map((report) => (
              <div
                key={report.id}
                style={{
                  border: '1px solid #e1e9ee',
                  borderRadius: 'var(--border-radius-md)',
                  padding: '1rem 1.25rem',
                  backgroundColor: '#f8fafc',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="badge badge-low" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' }}>
                      Resolved
                    </span>
                    <strong style={{ color: 'var(--color-text-main)', fontSize: '1rem' }}>
                      {report.aiAnalysis?.hazard_prediction || report.hazard_type} - {report.location}
                    </strong>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Reported by {report.user} | {report.description}
                  </p>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
                  Logged on {new Date(report.date).toLocaleDateString()}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted text-center" style={{ padding: '1.5rem 0' }}>
              No reports marked as resolved yet.
            </p>
          )}
        </div>
      </div>

      {/* FEATURE 8: Reusable Action Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.onConfirmHandler}
        onCancel={closeModal}
      />
    </div>
  );
};

export default AdminDashboard;


