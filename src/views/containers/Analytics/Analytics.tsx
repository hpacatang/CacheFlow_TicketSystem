import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import Layout from '../../Layout';
import "./Analytics.css";

const COLORS = ["#167BBB", "#7CA7C7", "#B7D3E6", "#E6E6E6", "#7CB67C"];

const categoriesData = [
  { name: "General issues", value: 400 },
  { name: "Product specific / Macro ...", value: 300 },
  { name: "Product specific / Helpdesk", value: 200 },
  { name: "Product specific / AspNet...", value: 100 },
  { name: "Product specific / LiveChat", value: 50 }
];

const statusData = [
  { name: "In progress", value: 300 },
  { name: "Resolved", value: 500 },
  { name: "New", value: 200 }
];

const priorityData = [
  { name: "Normal", value: 350 },
  { name: "Critical", value: 100 },
  { name: "High", value: 150 }
];

const totalData = [
  { name: "Tickets created", value: 600 },
  { name: "Of them closed", value: 400 },
  { name: "Still open", value: 200 }
];

export const Analytics = () => (
  <Layout module="analytics">
    <div className="analytics-content">
      <div className="analytics-header">
        <h1 className="analytics-title">Reporting & Analytics</h1>
        <div className="analytics-period">
          <span className="period-label">Period:</span>
          <select className="period-select">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 24 hours</option>
          </select>
        </div>
      </div>

      <div className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-icon tickets"></div>
          <div className="metric-content">
            <div className="metric-value">143</div>
            <div className="metric-label">Tickets resolved</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon time"></div>
          <div className="metric-content">
            <div className="metric-value">2h 30m</div>
            <div className="metric-label">Average resolution time</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-icon rating"></div>
          <div className="metric-content">
            <div className="metric-value">4.5 / 5</div>
            <div className="metric-label">Satisfaction ratings</div>
          </div>
        </div>
      </div>

      <h2 className="analytics-subtitle">Ticket Summary</h2>
      <div className="analytics-charts">
        <div className="chart-card">
          <h3 className="chart-title">Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoriesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                layout="vertical"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                layout="vertical"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Priority</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-priority-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                layout="vertical"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3 className="chart-title">Total</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={totalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={45}
              >
                {totalData.map((entry, index) => (
                  <Cell key={`cell-total-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend 
                verticalAlign="bottom" 
                align="center" 
                layout="vertical"
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </Layout>
);