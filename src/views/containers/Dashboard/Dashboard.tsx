import React from "react";
import { Typography, Divider, LinearProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import "./Dashboard.css";

export const Dashboard = () => {
  const stats = {
    unresolved: 5,
    overdue: 2,
    dueToday: 3,
    resolved: 12,
    avgResolutionTime: "4h 30m",
    satisfaction: {
      positive: 80,
      neutral: 15,
      negative: 5,
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <h2>ITicket Help Desk Summary</h2>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card">
          <AssignmentIcon className="stat-icon" />
          <p className="stat-title">Unresolved</p>
          <p className="stat-value">{stats.unresolved}</p>
        </div>
        <div className="stat-card">
          <ErrorOutlineIcon className="stat-icon" />
          <p className="stat-title">Overdue</p>
          <p className="stat-value">{stats.overdue}</p>
        </div>
        <div className="stat-card">
          <AccessTimeIcon className="stat-icon" />
          <p className="stat-title">Due Today</p>
          <p className="stat-value">{stats.dueToday}</p>
        </div>
        <div className="stat-card">
          <AssignmentTurnedInIcon className="stat-icon" />
          <p className="stat-title">Resolved</p>
          <p className="stat-value">{stats.resolved}</p>
        </div>
      </div>

      <div className="section-card">
        <h2>Customer Satisfaction</h2>

        <div className="progress-row">
          <ThumbUpAltIcon style={{ color: "#4CAF50" }} />
          <p className="progress-label">Positive</p>
          <LinearProgress variant="determinate" value={stats.satisfaction.positive} className="progress-bar success" />
          <p className="progress-percent">{stats.satisfaction.positive}%</p>
        </div>

        <div className="progress-row">
          <ThumbDownAltIcon style={{ color: "#F89B5D" }} />
          <p className="progress-label">Neutral</p>
          <LinearProgress variant="determinate" value={stats.satisfaction.neutral} className="progress-bar warning" />
          <p className="progress-percent">{stats.satisfaction.neutral}%</p>
        </div>

        <div className="progress-row">
          <ThumbDownAltIcon style={{ color: "#F44336" }} />
          <p className="progress-label">Negative</p>
          <LinearProgress variant="determinate" value={stats.satisfaction.negative} className="progress-bar error" />
          <p className="progress-percent">{stats.satisfaction.negative}%</p>
        </div>
      </div>

      <div className="section-card">
        <h2>Agent Performance</h2>
        <p><strong>Tickets Resolved:</strong> {stats.resolved}</p>
        <Divider sx={{ my: 1 }} />
        <p><strong>Average Resolution Time:</strong> {stats.avgResolutionTime}</p>
      </div>
    </div>
  );
};
