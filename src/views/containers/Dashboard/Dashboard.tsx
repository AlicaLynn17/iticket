import React, { useEffect, useState } from "react";
import { Divider, LinearProgress } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import axios from "axios";
import "./Dashboard.css";

export const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [tickets, setTickets] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [preferences, setPreferences] = useState({
    showStats: true,
    showSatisfaction: true,
    showPerformance: true,
    cardOrder: ["unresolved", "overdue", "dueToday", "resolved"],
  });

  const [stats, setStats] = useState({
    unresolved: 0,
    overdue: 0,
    dueToday: 0,
    resolved: 0,
    avgResolutionTime: "N/A",
  });

  const [satisfaction, setSatisfaction] = useState({
    positive: 0,
    neutral: 0,
    negative: 0,
  });

  // ✅ Fetch tickets and feedback
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketsRes, feedbackRes] = await Promise.all([
          axios.get("http://localhost:3000/tickets"),
          axios.get("http://localhost:3000/feedback"),
        ]);
        setTickets(ticketsRes.data);
        setFeedback(feedbackRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Fetch preferences
  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:3000/users/${userId}`).then((res) => {
      if (res.data.preferences) {
        setPreferences((prev) => ({
          ...prev,
          ...res.data.preferences,
          cardOrder:
            res.data.preferences.cardOrder || [
              "unresolved",
              "overdue",
              "dueToday",
              "resolved",
            ],
        }));
      }
    });
  }, [userId]);

  // ✅ Compute ticket stats
  useEffect(() => {
    if (tickets.length === 0) return;

    const today = new Date();

    const unresolved = tickets.filter(
      (t) => t.status && !["Closed", "Resolved"].includes(t.status)
    ).length;
    const resolved = tickets.filter((t) =>
      ["Closed", "Resolved"].includes(t.status)
    ).length;
    const overdue = tickets.filter((t) => {
      const due = new Date(t.dueDate);
      return t.status !== "Closed" && t.status !== "Resolved" && due < today;
    }).length;
    const dueToday = tickets.filter((t) => {
      const due = new Date(t.dueDate);
      return (
        t.status !== "Closed" &&
        t.status !== "Resolved" &&
        due.getDate() === today.getDate() &&
        due.getMonth() === today.getMonth() &&
        due.getFullYear() === today.getFullYear()
      );
    }).length;

    // Compute average resolution time
    const resolutionTimes = tickets
      .filter((t) => t.createdAt && t.resolvedAt)
      .map(
        (t) =>
          new Date(t.resolvedAt).getTime() - new Date(t.createdAt).getTime()
      );

    let avgResolutionTime = "N/A";
    if (resolutionTimes.length > 0) {
      const avgMs =
        resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length;
      const hours = Math.floor(avgMs / (1000 * 60 * 60));
      const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
      avgResolutionTime = `${hours}h ${minutes}m`;
    }

    setStats({ unresolved, overdue, dueToday, resolved, avgResolutionTime });
  }, [tickets]);

  // ✅ Compute satisfaction stats
  useEffect(() => {
    if (feedback.length === 0) return;

    const total = feedback.length;
    const positive = feedback.filter((f) => f.rating >= 4).length;
    const neutral = feedback.filter((f) => f.rating === 3).length;
    const negative = feedback.filter((f) => f.rating <= 2).length;

    setSatisfaction({
      positive: Math.round((positive / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      negative: Math.round((negative / total) * 100),
    });
  }, [feedback]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      {/* --- Ticket Stats --- */}
      {preferences.showStats && (
        <div className="dashboard-grid">
          {preferences.cardOrder.map((card) => {
            switch (card) {
              case "unresolved":
                return (
                  <div className="stat-card" key="unresolved">
                    <AssignmentIcon className="stat-icon" />
                    <p className="stat-title">Unresolved</p>
                    <p className="stat-value">{stats.unresolved}</p>
                  </div>
                );
              case "overdue":
                return (
                  <div className="stat-card" key="overdue">
                    <ErrorOutlineIcon className="stat-icon" />
                    <p className="stat-title">Overdue</p>
                    <p className="stat-value">{stats.overdue}</p>
                  </div>
                );
              case "dueToday":
                return (
                  <div className="stat-card" key="dueToday">
                    <AccessTimeIcon className="stat-icon" />
                    <p className="stat-title">Due Today</p>
                    <p className="stat-value">{stats.dueToday}</p>
                  </div>
                );
              case "resolved":
                return (
                  <div className="stat-card" key="resolved">
                    <AssignmentTurnedInIcon className="stat-icon" />
                    <p className="stat-title">Resolved</p>
                    <p className="stat-value">{stats.resolved}</p>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      {/* --- Customer Satisfaction --- */}
      {preferences.showSatisfaction && (
        <div className="section-card">
          <h2>Customer Satisfaction</h2>
          <div className="progress-row">
            <ThumbUpAltIcon style={{ color: "#4CAF50" }} />
            <p className="progress-label">Positive</p>
            <LinearProgress
              variant="determinate"
              value={satisfaction.positive}
              className="progress-bar success"
            />
            <p className="progress-percent">{satisfaction.positive}%</p>
          </div>
          <div className="progress-row">
            <ThumbDownAltIcon style={{ color: "#F89B5D" }} />
            <p className="progress-label">Neutral</p>
            <LinearProgress
              variant="determinate"
              value={satisfaction.neutral}
              className="progress-bar warning"
            />
            <p className="progress-percent">{satisfaction.neutral}%</p>
          </div>
          <div className="progress-row">
            <ThumbDownAltIcon style={{ color: "#F44336" }} />
            <p className="progress-label">Negative</p>
            <LinearProgress
              variant="determinate"
              value={satisfaction.negative}
              className="progress-bar error"
            />
            <p className="progress-percent">{satisfaction.negative}%</p>
          </div>
        </div>
      )}
    </div>
  );
};
