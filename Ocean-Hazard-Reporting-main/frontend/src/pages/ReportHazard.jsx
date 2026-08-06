import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, MapPin, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import AIResultCard from '../components/AIResultCard';

const ReportHazard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    latitude: '',
    longitude: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedResult, setSubmittedResult] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [aiError, setAiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Automatic geocoding when user enters a valid location
  const handleLocationBlur = async () => {
    if (!formData.location || formData.location.trim().length < 3) return;
    setGeocodingLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(data[0].lat).toFixed(6),
          longitude: parseFloat(data[0].lon).toFixed(6),
        }));
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setGeocodingLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6),
          }));
          setGeocodingLoading(false);
        },
        () => {
          alert('Could not get current location via browser. Entering a location string will auto-detect coordinates.');
          setGeocodingLoading(false);
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSubmittedResult(null);
    setAiAnalysisResult(null);
    setAiError('');

    // Fallback lat/long if geocoding wasn't triggered
    const lat = formData.latitude || '13.0827';
    const lng = formData.longitude || '80.2707';

    try {
      const payload = new FormData();
      payload.append('hazard_type', 'Other'); // Backend payload compatibility
      payload.append('severity', 'Medium');    // Backend payload compatibility
      payload.append('description', formData.description);
      payload.append('location', formData.location);
      payload.append('latitude', lat);
      payload.append('longitude', lng);
      if (imageFile) payload.append('image', imageFile);

      // Step 1: Upload report to backend
      const reportRes = await api.post('/reports', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const createdReport = reportRes.data.report;

      setSubmittedResult(createdReport);

      // Step 2: Trigger AI analysis on backend if image was uploaded (non-blocking)
      if (imageFile && createdReport?.id) {
        try {
          const aiPayload = new FormData();
          aiPayload.append('report_id', createdReport.id);
          aiPayload.append('image', imageFile);
          const aiRes = await api.post('/ai/analyze', aiPayload, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setAiAnalysisResult(aiRes.data);
        } catch (aiErr) {
          console.error('AI analysis failed:', aiErr);
          setAiError(
            aiErr.response?.data?.message ||
              'Report submitted, but AI image analysis failed. You can retry analysis from the dashboard.',
          );
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ location: '', description: '', latitude: '', longitude: '' });
    setImageFile(null);
    setImagePreview(null);
    setSubmittedResult(null);
    setAiAnalysisResult(null);
    setAiError('');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-4">Submit Hazard Report</h2>

      {/* Success View after Submission */}
      {submittedResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ backgroundColor: 'var(--color-success-light)', borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 color="var(--color-success)" size={28} />
              <h3 style={{ margin: 0, color: 'var(--color-success)' }}>Report Submitted Successfully!</h3>
            </div>
            <p style={{ margin: 0, color: 'var(--color-text-main)' }}>
              Your report for <strong>{submittedResult.location}</strong> has been logged into the system and sent for authority review.
            </p>
          </div>

          {/* AI Analysis Display Card */}
          {aiAnalysisResult && <AIResultCard analysis={aiAnalysisResult} />}

          {aiError && (
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                borderLeft: '4px solid var(--color-danger)',
              }}
            >
              {aiError}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Go to Citizen Dashboard <ArrowRight size={18} />
            </button>
            <button onClick={handleReset} className="btn btn-secondary">
              Submit Another Report
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          {error && (
            <div
              style={{
                backgroundColor: 'var(--color-danger-light)',
                color: 'var(--color-danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--border-radius-sm)',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Loading state while AI analysis is running */}
          {loading ? (
            <div style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
              <Loader2
                size={48}
                color="var(--color-primary)"
                style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }}
              />
              <h3 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Analyzing image using AI...</h3>
              <p className="text-muted">Please wait while Gemini evaluates the ocean hazard evidence.</p>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Location Input */}
              <div className="form-group">
                <label className="form-label">
                  Location <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    placeholder="E.g., Marina Beach, Chennai"
                    value={formData.location}
                    onChange={handleChange}
                    onBlur={handleLocationBlur}
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    className="btn btn-secondary"
                    style={{ padding: '0 0.75rem', flexShrink: 0 }}
                    title="Get Current GPS Location"
                  >
                    <MapPin size={18} />
                  </button>
                </div>
                {geocodingLoading ? (
                  <small style={{ color: 'var(--color-primary)', marginTop: '0.25rem', display: 'block' }}>
                    Auto-detecting coordinates...
                  </small>
                ) : (
                  <small className="text-muted" style={{ display: 'block', marginTop: '0.25rem' }}>
                    Latitude and Longitude are automatically generated from your location.
                  </small>
                )}
              </div>

              {/* Read-only Latitude & Longitude */}
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Latitude (Auto-generated)</label>
                  <input
                    type="text"
                    name="latitude"
                    className="form-control"
                    value={formData.latitude}
                    placeholder="Auto-generated lat"
                    readOnly
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude (Auto-generated)</label>
                  <input
                    type="text"
                    name="longitude"
                    className="form-control"
                    value={formData.longitude}
                    placeholder="Auto-generated lng"
                    readOnly
                    style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }}
                    required
                  />
                </div>
              </div>

              {/* Hazard Description */}
              <div className="form-group">
                <label className="form-label">
                  Hazard Description <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Describe what you observed (e.g. dark oil slicks washing ashore, high wave surge, plastic waste accumulation)..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Upload Image with Preview */}
              <div className="form-group">
                <label className="form-label">Upload Evidence (Photo)</label>
                <div
                  style={{
                    border: '2px dashed #c9d8e0',
                    padding: '2rem',
                    textAlign: 'center',
                    borderRadius: 'var(--border-radius-md)',
                    cursor: 'pointer',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <UploadCloud size={36} color="var(--color-primary)" />
                    <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Click to upload an image</span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>PNG, JPG up to 5MB</span>
                  </label>
                </div>
                {imagePreview && (
                  <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p style={{ fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Hazard evidence preview"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '250px',
                        borderRadius: 'var(--border-radius-sm)',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid #e1e9ee',
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1rem', marginTop: '1rem' }}
                disabled={loading}
              >
                Submit Hazard Report
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportHazard;

