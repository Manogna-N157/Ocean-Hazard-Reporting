import React, { useEffect, useState } from 'react';
import { BrainCircuit, ImageUp, Loader2, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const RiskBadge = ({ risk }) => <span className={`badge badge-${(risk || 'low').toLowerCase()}`}>{risk || 'Low'}</span>;

const SocialMediaAnalyzer = () => {
  const [mode, setMode] = useState('text');
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try { setHistory((await api.get('/social-media/history')).data.analyses || []); } catch (err) { setError(err.response?.data?.message || 'Unable to load recent analyses.'); }
  };
  useEffect(() => { loadHistory(); }, []);

  const analyze = async (event) => {
    event.preventDefault(); setLoading(true); setError(''); setMessage('');
    try {
      let response;
      if (mode === 'text') response = await api.post('/social-media/analyze-text', { text });
      else if (mode === 'url') response = await api.post('/social-media/analyze-url', { url });
      else { const body = new FormData(); body.append('image', image); response = await api.post('/social-media/analyze-image', body, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      setAnalysis(response.data.analysis); setMessage('Analysis completed successfully.'); loadHistory();
    } catch (err) {
      const backendMessage = err.response?.data?.message || '';
      setError(mode === 'url' && (err.response?.status === 422 || /paste.*text manually/i.test(backendMessage))
        ? 'Unable to extract content from this link. Please paste the post text manually or upload a screenshot.'
        : backendMessage || 'Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };
  const clear = () => { setText(''); setUrl(''); setImage(null); setAnalysis(null); setMessage(''); setError(''); };
  const createReport = async () => {
    setCreating(true); setError('');
    try { const response = await api.post('/social-media/create-report', { analysis_id: analysis.id }); setMessage(`${response.data.message} Status: Pending.`); loadHistory(); }
    catch (err) { setError(err.response?.data?.message || 'Unable to create the official hazard report.'); } finally { setCreating(false); }
  };

  return <div className="main-content">
    <div className="mb-4"><h2>Social Media Analyzer</h2><p className="text-muted">Analyze manually supplied ocean-hazard posts or screenshots with OceanGuard AI.</p></div>
    {message && <div className="notice notice-success">{message}</div>}{error && <div className="notice notice-error">{error}</div>}
    <div className="card mb-4">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}><button type="button" className={`btn ${mode === 'text' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('text')}>Analyze Text</button><button type="button" className={`btn ${mode === 'image' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('image')}>Analyze Image</button><button type="button" className={`btn ${mode === 'url' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setMode('url')}>Analyze URL</button></div>
      <form onSubmit={analyze}>
        {mode === 'text' ? <textarea className="form-control" value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a social media post related to an ocean hazard..." style={{ minHeight: '180px' }} required /> : mode === 'url' ? <div className="form-group"><label className="form-label">Public post URL</label><input className="form-control" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste a public social media or news link..." required /><small className="text-muted">Examples: https://x.com/..., https://facebook.com/..., https://reddit.com/..., or https://www.example.com/news/...</small></div> : <div className="form-group"><label className="form-label">Social-media screenshot or image</label><input className="form-control" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required /><small className="text-muted">PNG, JPG, WEBP, or GIF up to 5 MB.</small></div>}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}><button className="btn btn-primary" disabled={loading}>{loading ? <><Loader2 size={17} /> Analyzing...</> : <><BrainCircuit size={17} /> Analyze</>}</button><button type="button" className="btn btn-secondary" onClick={clear}>Clear</button></div>
      </form>
    </div>
    {analysis && <div className="card mb-4" style={{ borderLeft: '4px solid var(--color-secondary)' }}><h3>AI Analysis Result</h3><div className="grid-2"><p><strong>Detected Hazard:</strong> {analysis.detected_hazard}</p><p><strong>Confidence Score:</strong> {Math.round(Number(analysis.confidence_score))}%</p><p><strong>Risk Level:</strong> <RiskBadge risk={analysis.risk_level} /></p><p><strong>Should Investigate:</strong> {analysis.shouldInvestigate ? 'Yes' : 'No'}</p></div><p><strong>Summary:</strong> {analysis.summary}</p><p><strong>Recommendation:</strong> {analysis.recommendation}</p>{analysis.shouldInvestigate && <button className="btn btn-primary" disabled={creating} onClick={createReport}>{creating ? 'Creating...' : <><ShieldCheck size={17} /> Create Official Hazard Report</>}</button>}</div>}
    <h3 className="mb-3">Recent Analyses</h3><div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>{history.map((item) => <div className="card" key={item.id}><p className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(item.createdAt || item.created_at).toLocaleString()} · {item.input_type}</p><h4>{item.detected_hazard}</h4><RiskBadge risk={item.risk_level} /><p style={{ marginTop: '0.75rem' }}>{item.summary}</p></div>)}{!history.length && <p className="text-muted">No analyses yet.</p>}</div>
  </div>;
};
export default SocialMediaAnalyzer;
