import React from 'react';
import { HazardBarChart, SentimentPieChart } from '../components/Charts';
import StatisticsCard from '../components/StatisticsCard';
import { MessageCircle, TrendingUp, Hash, Eye } from 'lucide-react';

const Analytics = () => {
  // Dummy analytics data
  const barData = [
    { name: 'Mon', reports: 45 },
    { name: 'Tue', reports: 52 },
    { name: 'Wed', reports: 38 },
    { name: 'Thu', reports: 65 },
    { name: 'Fri', reports: 48 },
    { name: 'Sat', reports: 70 },
    { name: 'Sun', reports: 85 },
  ];

  const pieData = [
    { name: 'Positive/Neutral', value: 35 },
    { name: 'Concerned', value: 45 },
    { name: 'Emergency', value: 20 },
  ];

  const trendingKeywords = ['#OilSpill', '#MarineLife', '#SaveOurOceans', '#CycloneAlert', 'Beach Cleanup'];

  return (
    <div className="main-content">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Social Media Analytics Dashboard</h2>
        <p className="text-muted">Analyzing social media streams to detect early signs of ocean hazards.</p>
      </div>

      <div className="grid-4 mb-4">
        <StatisticsCard title="Total Mentions" value="12.5K" icon={MessageCircle} color="var(--color-primary)" />
        <StatisticsCard title="Detected Hazards" value="48" icon={Eye} color="var(--color-warning)" />
        <StatisticsCard title="Engagement Rate" value="8.4%" icon={TrendingUp} color="var(--color-success)" />
        <StatisticsCard title="Top Keyword" value="#OilSpill" icon={Hash} color="var(--color-secondary)" />
      </div>

      <div className="grid-2 mb-4">
        <div className="card">
          <h3 className="mb-4">Social Media Mentions (Last 7 Days)</h3>
          <HazardBarChart data={barData} />
        </div>
        
        <div className="card">
          <h3 className="mb-4">Public Sentiment Overview</h3>
          <SentimentPieChart data={pieData} />
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="mb-3">Trending Keywords</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {trendingKeywords.map((keyword, index) => (
              <span key={index} style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: 'var(--color-primary-light)', 
                color: 'white', 
                borderRadius: 'var(--border-radius-lg)',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {keyword}
              </span>
            ))}
          </div>
        </div>
        
        <div className="card">
          <h3 className="mb-3">Live Stream (Simulated)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-warning)', backgroundColor: 'var(--color-warning-light)' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>"Seeing weird black patches in the water near Juhu Beach. #OilSpill #Mumbai"</p>
              <small className="text-muted">@concerned_citizen • 2 mins ago</small>
            </div>
            <div style={{ padding: '1rem', borderLeft: '3px solid var(--color-primary)', backgroundColor: '#f1f5f9' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>"Organizing a beach cleanup this weekend! Let's #SaveOurOceans"</p>
              <small className="text-muted">@eco_warrior • 15 mins ago</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
