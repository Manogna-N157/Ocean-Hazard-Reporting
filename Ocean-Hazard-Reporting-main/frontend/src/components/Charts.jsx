import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const HazardBarChart = ({ data }) => {
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e1e9ee" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <RechartsTooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
          />
          <Legend />
          <Bar dataKey="reports" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SentimentPieChart = ({ data }) => {
  const COLORS = ['var(--color-success)', 'var(--color-warning)', 'var(--color-danger)'];
  
  return (
    <div style={{ height: '300px', width: '100%' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
