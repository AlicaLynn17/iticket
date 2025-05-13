import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";

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

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Customer Feedback
      </Typography>
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
          {feedback.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{item.ticketId}</TableCell>
              <TableCell>{item.userId}</TableCell>
              <TableCell>{item.rating}</TableCell>
              <TableCell>{item.comments}</TableCell>
              <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};