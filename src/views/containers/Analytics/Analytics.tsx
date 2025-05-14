import React from "react";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarRateIcon from "@mui/icons-material/StarRate";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import "./Analytics.css";

const COLORS = ["#7ca7c7", "#b7d3e6", "#e6e6e6", "#7cb67c", "#e6b77c"];

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
  <div className="analytics-container">
    <div className="analytics-content">
      <h1 className="analytics-title">Reporting & Analytics</h1>
      <div className="analytics-section analytics-metrics">
        <div className="analytics-metric-card">
          <ConfirmationNumberIcon style={{ fontSize: 40 }} />
          <div className="analytics-metric-value">143</div>
          <div className="analytics-metric-label">Tickets resolved</div>
        </div>
        <div className="analytics-metric-card">
          <AccessTimeIcon style={{ fontSize: 40 }} />
          <div className="analytics-metric-value">2h 30m</div>
          <div className="analytics-metric-label">Average resolution time</div>
        </div>
        <div className="analytics-metric-card">
          <StarRateIcon style={{ fontSize: 40 }} />
          <div className="analytics-metric-value">4.5 / 5</div>
          <div className="analytics-metric-label">Satisfaction ratings</div>
        </div>
      </div>
      <h2 className="analytics-subtitle">Ticket Summary</h2>
      <div className="analytics-section analytics-charts">
        <div className="analytics-chart-card">
          <div className="analytics-chart-title">Categories</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoriesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={false}
              >
                {categoriesData.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="analytics-chart-card">
          <div className="analytics-chart-title">Status</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={false}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-status-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="analytics-chart-card">
          <div className="analytics-chart-title">Priority</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={priorityData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={false}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-priority-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="analytics-chart-card">
          <div className="analytics-chart-title">Total</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={totalData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={false}
              >
                {totalData.map((entry, index) => (
                  <Cell key={`cell-total-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);
