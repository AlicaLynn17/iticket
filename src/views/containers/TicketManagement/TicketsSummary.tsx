import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Paper, Typography, Chip } from "@mui/material";
import axios from "axios";
import "./TicketsSummary.css";
export const TicketsSummary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/tickets/${id}`).then((res) => setTicket(res.data));
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, [id]);

  const getAssignedUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unassigned";
  };

  if (!ticket) return <p>Loading ticket summary...</p>;

  return (
    <div className="ticket-summary-container">
        <div className="ticket-summary-box">
          <Button
            variant="outlined"
            className="back-button"
            onClick={() => navigate("/view-tickets")}
          >
            ← Back to Tickets
          </Button>
          <h1>{ticket.title}</h1>
          <div className="meta">
    <div className="meta-item">
      <strong>Priority:</strong>
      <Chip
        label={ticket.priority}
        className="chip"
        color={
          ticket.priority === "High"
            ? "error"
            : ticket.priority === "Medium"
            ? "warning"
            : "success"
        }
        size="small"
      />
    </div>
    <div className="meta-item"><strong>Status:</strong> {ticket.status}</div>
    <div className="meta-item"><strong>Due Date:</strong> {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString("en-GB") : "—"}</div>
    <div className="meta-item"><strong>Assigned To:</strong> {getAssignedUserName(ticket.assignedTo)}</div>
  </div>


        <p className="description">{ticket.description}</p>

        {(ticket.status === "Resolved" || ticket.status === "Closed") && (
          <Button
            className="feedback-button"
            variant="contained"
            onClick={() => navigate(`/collect-feedback/${ticket.id}`)}
          >
            Leave Feedback
          </Button>
        )}

      </div>
    </div>
  );

};
