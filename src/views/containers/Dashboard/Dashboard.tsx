import React, { useEffect, useState } from "react";
import { Typography, Divider, LinearProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    unresolved: 0,
    overdue: 0,
    dueToday: 0,
    resolved: 0,
    avgResolutionTime: "N/A"
  });

  const satisfaction = {
    positive: 80,
    neutral: 15,
    negative: 5
  };

  useEffect(() => {
    axios.get("http://localhost:3000/tickets").then((res) => {
      setTickets(res.data);
    });
  }, []);

  useEffect(() => {
    const today = new Date();

    const unresolved = tickets.filter((t) => t.status !== "Closed").length;
    const resolved = tickets.filter((t) => t.status === "Closed").length;
    const overdue = tickets.filter((t) => {
      const due = new Date(t.dueDate);
      return t.status !== "Closed" && due < today;
    }).length;
    const dueToday = tickets.filter((t) => {
      const due = new Date(t.dueDate);
      return (
        t.status !== "Closed" &&
        due.getDate() === today.getDate() &&
        due.getMonth() === today.getMonth() &&
        due.getFullYear() === today.getFullYear()
      );
    }).length;

    const resolutionTimes: number[] = tickets
      .filter((t) => t.createdAt && t.resolvedAt)
      .map((t) => {
        const created = new Date(t.createdAt).getTime();
        const resolved = new Date(t.resolvedAt).getTime();
        return resolved - created;
      });

    let avgResolutionTime = "N/A";
    if (resolutionTimes.length > 0) {
      const avgMs = resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
      const hours = Math.floor(avgMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      avgResolutionTime = `${hours}h ${minutes}m`;
    }

    setStats({ unresolved, resolved, overdue, dueToday, avgResolutionTime });
  }, [tickets]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
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
          <LinearProgress variant="determinate" value={satisfaction.positive} className="progress-bar success" />
          <p className="progress-percent">{satisfaction.positive}%</p>
        </div>

        <div className="progress-row">
          <ThumbDownAltIcon style={{ color: "#F89B5D" }} />
          <p className="progress-label">Neutral</p>
          <LinearProgress variant="determinate" value={satisfaction.neutral} className="progress-bar warning" />
          <p className="progress-percent">{satisfaction.neutral}%</p>
        </div>

        <div className="progress-row">
          <ThumbDownAltIcon style={{ color: "#F44336" }} />
          <p className="progress-label">Negative</p>
          <LinearProgress variant="determinate" value={satisfaction.negative} className="progress-bar error" />
          <p className="progress-percent">{satisfaction.negative}%</p>
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
