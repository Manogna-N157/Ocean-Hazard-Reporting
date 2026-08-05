import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, MapPin } from 'lucide-react';
import api from '../services/api';

const ReportHazard = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'Oil Spill',
    description: '',
    location: '',
    latitude: '',
    longitude: '',
    severity: 'Medium'
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toFixed(6),
            longitude: position.coords.longitude.toFixed(6)
          });
        },
        (err) => {
          alert('Could not get location. Please enter manually.');
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('hazard_type', formData.type);
      ['description', 'location', 'latitude', 'longitude', 'severity'].forEach((field) => payload.append(field, formData[field]));
      if (imageFile) payload.append('image', imageFile);
      await api.post('/reports', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLoading(false);
      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report.');
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 className="mb-4">Submit Hazard Report</h2>
      
      <div className="card">
        {error && (
          <div style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Hazard Type</label>
              <select name="type" className="form-control" value={formData.type} onChange={handleChange} required>
                <option value="Oil Spill">Oil Spill</option>
                <option value="Cyclone">Cyclone</option>
                <option value="High Waves">High Waves</option>
                <option value="Plastic Pollution">Plastic Pollution</option>
                <option value="Marine Animal Death">Marine Animal Death</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Severity</label>
              <select name="severity" className="form-control" value={formData.severity} onChange={handleChange} required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location Description</label>
            <input 
              type="text" 
              name="location" 
              className="form-control" 
              placeholder="E.g., Marina Beach, near lighthouse" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input 
                type="text" 
                name="latitude" 
                className="form-control" 
                value={formData.latitude} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Longitude</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  name="longitude" 
                  className="form-control" 
                  value={formData.longitude} 
                  onChange={handleChange} 
                  required 
                />
                <button type="button" onClick={getCurrentLocation} className="btn btn-secondary" style={{ padding: '0 0.75rem' }} title="Get Current Location">
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea 
              name="description" 
              className="form-control" 
              placeholder="Provide details about the hazard..." 
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Upload Evidence (Photo)</label>
            <div style={{ 
              border: '2px dashed #c9d8e0', 
              padding: '2rem', 
              textAlign: 'center', 
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              backgroundColor: '#f8fafc'
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
                id="file-upload" 
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <UploadCloud size={32} color="var(--color-primary)" />
                <span style={{ color: 'var(--color-text-main)', fontWeight: '500' }}>Click to upload an image</span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>PNG, JPG up to 5MB</span>
              </label>
            </div>
            {imagePreview && (
              <div style={{ mt: '1rem', textAlign: 'center' }}>
                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 'var(--border-radius-sm)', marginTop: '1rem' }} />
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Hazard Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportHazard;
