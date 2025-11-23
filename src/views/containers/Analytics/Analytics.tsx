import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, LabelList, Tooltip } from "recharts";
import Layout from '../../Layout';
import { analyticsApi, AnalyticsData } from '../../../constant/analyticsApi';
import "./Analytics.css";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57", 
  "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
  "#10AC84", "#EE5A6F", "#C44569", "#F8B500", "#6C5CE7"
];

// Custom label rendering function for pie charts
const renderCustomizedLabel = (entry: any) => {
  const percent = ((entry.value / entry.payload.reduce((a: number, b: any) => a + b.value, 0)) * 100).toFixed(1);
  return `${entry.value} (${percent}%)`;
};

// Custom tooltip for better data display
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, fontWeight: 'bold', color: payload[0].payload.fill }}>
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last30days');

  const fetchAnalyticsData = async (period: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analyticsApi.getAnalyticsData(period);
      setAnalyticsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      console.error('Analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(selectedPeriod);
  }, [selectedPeriod]);

  const handlePeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriod(event.target.value);
  };

  if (loading) {
    return (
      <Layout module="analytics">
        <div className="analytics-content">
          <div className="analytics-header">
            <h1 className="analytics-title">Reporting & Analytics</h1>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            fontSize: '18px',
            color: '#666'
          }}>
            Loading analytics data...
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout module="analytics">
        <div className="analytics-content">
          <div className="analytics-header">
            <h1 className="analytics-title">Reporting & Analytics</h1>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            fontSize: '18px',
            color: '#d32f2f',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div>Error loading analytics data: {error}</div>
            <button 
              onClick={() => fetchAnalyticsData(selectedPeriod)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#167BBB',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!analyticsData) {
    return (
      <Layout module="analytics">
        <div className="analytics-content">
          <div className="analytics-header">
            <h1 className="analytics-title">Reporting & Analytics</h1>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '400px',
            fontSize: '18px',
            color: '#666'
          }}>
            No analytics data available
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout module="analytics">
      <div className="analytics-content">
        <div className="analytics-header">
          <h1 className="analytics-title">Reporting & Analytics</h1>
          <div className="analytics-period">
            <span className="period-label">Period:</span>
            <select 
              className="period-select" 
              value={selectedPeriod} 
              onChange={handlePeriodChange}
            >
              <option value="last30days">Last 30 days</option>
              <option value="last7days">Last 7 days</option>
              <option value="last24hours">Last 24 hours</option>
            </select>
          </div>
        </div>

        <div className="analytics-metrics">
          <div className="metric-card">
            <div className="metric-icon tickets"></div>
            <div className="metric-content">
              <div className="metric-value">{analyticsData.metrics.ticketsResolved}</div>
              <div className="metric-label">Tickets resolved</div>
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-icon rating"></div>
            <div className="metric-content">
              <div className="metric-value">
                {analyticsData.metrics.satisfactionRating > 0 
                  ? `${analyticsData.metrics.satisfactionRating} / 5` 
                  : 'No ratings'}
              </div>
              <div className="metric-label">Satisfaction ratings</div>
            </div>
          </div>
        </div>

        <h2 className="analytics-subtitle">Ticket Summary</h2>
        <div className="analytics-charts">
          <div className="chart-card">
            <h3 className="chart-title">Categories</h3>
            <ResponsiveContainer width="100%" height={250}>
              {analyticsData.categories.length > 0 ? (
                <PieChart>
                  <Pie
                    data={analyticsData.categories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={(entry: any) => {
                      const total = analyticsData.categories.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return entry.value > 0 ? `${entry.value}` : '';
                    }}
                  >
                    {analyticsData.categories.map((entry: any, index: number) => (
                      <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="vertical"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                    formatter={(value: string, entry: any) => {
                      const data = analyticsData.categories.find(item => item.name === value);
                      return data ? `${value} (${data.value})` : value;
                    }}
                  />
                </PieChart>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              {analyticsData.status.length > 0 ? (
                <PieChart>
                  <Pie
                    data={analyticsData.status}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={(entry: any) => {
                      const total = analyticsData.status.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return entry.value > 0 ? `${entry.value}` : '';
                    }}
                  >
                    {analyticsData.status.map((entry: any, index: number) => (
                      <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="vertical"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                    formatter={(value: string, entry: any) => {
                      const data = analyticsData.status.find(item => item.name === value);
                      return data ? `${value} (${data.value})` : value;
                    }}
                  />
                </PieChart>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Priority</h3>
            <ResponsiveContainer width="100%" height={250}>
              {analyticsData.priority.length > 0 ? (
                <PieChart>
                  <Pie
                    data={analyticsData.priority}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={(entry: any) => {
                      const total = analyticsData.priority.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return entry.value > 0 ? `${entry.value}` : '';
                    }}
                  >
                    {analyticsData.priority.map((entry: any, index: number) => (
                      <Cell key={`cell-priority-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="vertical"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                    formatter={(value: string, entry: any) => {
                      const data = analyticsData.priority.find(item => item.name === value);
                      return data ? `${value} (${data.value})` : value;
                    }}
                  />
                </PieChart>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3 className="chart-title">Total</h3>
            <ResponsiveContainer width="100%" height={250}>
              {analyticsData.total.length > 0 ? (
                <PieChart>
                  <Pie
                    data={analyticsData.total}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    labelLine={false}
                    label={(entry: any) => {
                      const total = analyticsData.total.reduce((sum, item) => sum + item.value, 0);
                      const percent = ((entry.value / total) * 100).toFixed(1);
                      return entry.value > 0 ? `${entry.value}` : '';
                    }}
                  >
                    {analyticsData.total.map((entry: any, index: number) => (
                      <Cell key={`cell-total-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center" 
                    layout="vertical"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }}
                    formatter={(value: string, entry: any) => {
                      const data = analyticsData.total.find(item => item.name === value);
                      return data ? `${value} (${data.value})` : value;
                    }}
                  />
                </PieChart>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Layout>
  );
};