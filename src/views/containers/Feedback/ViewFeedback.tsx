import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./ViewFeedback.css";

export const ViewFeedback = () => {
  const feedback = [
    {
      id: "1",
      ticketDescription: "App crashes when submitting form",
      user: "Franka Ong",
      rating: 4.5,
      comments: "Very helpful team. They fixed it fast.",
      createdAt: "2024-10-12T14:20:00",
    },
    {
      id: "2",
      ticketDescription: "Password reset email not sent",
      user: "Lhea Dizon",
      rating: 5,
      comments: "Smooth support experience!",
      createdAt: "2024-11-02T09:45:00",
    },
    {
      id: "3",
      ticketDescription: "UI glitch on dark mode",
      user: null,
      rating: 3.5,
      comments: "It works now but the fix took a while.",
      createdAt: "2024-12-01T18:10:00",
    },
  ];

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
                <TableCell>Ticket Description</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comments</TableCell>
                <TableCell>Submitted At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedback.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="no-feedback">
                    No feedback found.
                  </TableCell>
                </TableRow>
              ) : (
                feedback.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.ticketDescription.length > 40
                        ? item.ticketDescription.slice(0, 40) + "..."
                        : item.ticketDescription}
                    </TableCell>
                    <TableCell>{item.user || "Anonymous"}</TableCell>
                    <TableCell>{renderStars(item.rating)}</TableCell>
                    <TableCell>{item.comments}</TableCell>
                    <TableCell>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString()
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
