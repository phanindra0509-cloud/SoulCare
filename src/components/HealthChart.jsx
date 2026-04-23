import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const mockData = [
  { day: '1', stress: 45, anxietyEvents: 0 },
  { day: '5', stress: 42, anxietyEvents: 0 },
  { day: '10', stress: 68, anxietyEvents: 2 },
  { day: '15', stress: 74, anxietyEvents: 3 },
  { day: '20', stress: 55, anxietyEvents: 1 },
  { day: '25', stress: 40, anxietyEvents: 0 },
  { day: '30', stress: 35, anxietyEvents: 0 },
];

const HealthChart = () => {
  return (
    <div className="card glass-panel" style={{ flex: 1, minHeight: '300px' }}>
      <div className="card-header">
        <h3 className="card-title"><TrendingUp size={20} color="var(--color-brand-primary)" /> Monthly Health Overview</h3>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
        Your stress and anxiety levels over the past 30 days.
      </p>
      
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-bg-tertiary)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }}
              itemStyle={{ color: 'var(--color-text-primary)' }}
            />
            <Line type="monotone" dataKey="stress" stroke="var(--color-brand-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-brand-primary)' }} activeDot={{ r: 6 }} name="Avg Stress Level" />
            <Line type="monotone" dataKey="anxietyEvents" stroke="var(--color-accent-critical)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-accent-critical)' }} activeDot={{ r: 6 }} name="Panic Attacks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HealthChart;
