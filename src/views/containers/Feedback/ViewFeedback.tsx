import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
  Button,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import "./ViewFeedback.css";

export const ViewFeedback = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [feedbackRes, usersRes, ticketsRes] = await Promise.all([
        axios.get("http://localhost:3000/feedback"),
        axios.get("http://localhost:3000/users"),
        axios.get("http://localhost:3000/tickets"),
      ]);
      setFeedbackList(feedbackRes.data);
      setUsers(usersRes.data);
      setTickets(ticketsRes.data);
    };

    fetchData();
  }, []);

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Anonymous";
  };

  const getTicketDescription = (ticketId: string) => {
    const ticket = tickets.find((t) => String(t.id) === String(ticketId));
    return ticket ? ticket.title || ticket.description : "Unknown Ticket";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<StarIcon key={i} sx={{ color: "#F89B5D" }} />);
      } else if (rating >= i - 0.5) {
        stars.push(<StarHalfIcon key={i} sx={{ color: "#F89B5D" }} />);
      } else {
        stars.push(<StarBorderIcon key={i} sx={{ color: "#F89B5D" }} />);
      }
    }
    return <Stack direction="row" spacing={0.5}>{stars}</Stack>;
  };

  return (
    <Box className="view-feedback-container">
      <div className="view-feedback-box">
        <h1>Customer Feedback</h1>
        <Paper className="feedback-table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ticket</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="no-feedback">
                    No feedback found.
                  </TableCell>
                </TableRow>
              ) : (
                feedbackList.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{getTicketDescription(item.ticketId)}</TableCell>
                    <TableCell>{getUserName(item.userId || item.submittedBy)}</TableCell>
                    <TableCell>{renderStars(item.rating)}</TableCell>
                    <TableCell>{item.comments || item.content || "—"}</TableCell>
                    <TableCell>
                      {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-GB")
                      : "N/A"}

                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Box>
  );
};
