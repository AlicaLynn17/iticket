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
  const userId = user.id;

  const [tickets, setTickets] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  type Preferences = {
    showStats: boolean;
    showSatisfaction: boolean;
    cardOrder: string[];
  };

  const [preferences, setPreferences] = useState<Preferences>({
    showStats: true,
    showSatisfaction: true,
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
          axios.get("https://localhost:5001/api/Ticket/GetTickets"),
          axios.get("https://localhost:5001/api/Feedback/GetAll"),
        ]);

        console.log("🎟️ Tickets from API:", ticketsRes.data);
        console.log("👤 userId:", userId);

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
    axios.get(`https://localhost:5001/api/Preference/${userId}`).then((res) => {
      if (res.data) {
        setPreferences(res.data);
      }
    });
  }, [userId]);

  // ✅ Compute ticket stats
  useEffect(() => {
    if (tickets.length === 0 || !userId) return; // <-- important guard

    const userTickets = tickets.filter(
      (t) =>
        Number(t.createdBy) === Number(userId) ||
        Number(t.assignedTo) === Number(userId)
    );

    console.log("🧾 Filtered userTickets:", userTickets);

    const today = new Date();

    const resolved = userTickets.filter((t) =>
      ["closed", "resolved"].includes(t.status?.toLowerCase())
    ).length;

    const unresolved = userTickets.filter(
      (t) => !["closed", "resolved"].includes(t.status?.toLowerCase())
    ).length;

    const overdue = userTickets.filter((t) => {
      const due = new Date(t.dueDate);
      const status = t.status?.toLowerCase();
      return !["closed", "resolved"].includes(status) && due < today;
    }).length;

    const dueToday = userTickets.filter((t) => {
      const due = new Date(t.dueDate);
      const status = t.status?.toLowerCase();
      return (
        !["closed", "resolved"].includes(status) &&
        due.getDate() === today.getDate() &&
        due.getMonth() === today.getMonth() &&
        due.getFullYear() === today.getFullYear()
      );
    }).length;

    console.log({ resolved, unresolved, overdue, dueToday });

    setStats({
      unresolved,
      overdue,
      dueToday,
      resolved,
      avgResolutionTime: "N/A",
    });
  }, [tickets, userId]);

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
