import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import axios from "axios";
import "./ViewFeedback.css";

export const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:3000/feedback");
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchFeedback();
  }, []);

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
                <TableCell>Ticket ID</TableCell>
                <TableCell>User ID</TableCell>
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
                feedback.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.ticketId}</TableCell>
                    <TableCell>{item.userId || "Anonymous"}</TableCell>
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
