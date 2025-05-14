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
  Stack,
  Avatar,
  Rating
} from "@mui/material";
import axios from "axios";

type User = {
  id: string;
  name: string;
  // add other fields if needed
};

type FeedbackItem = {
  id: string;
  userId: string;
  ticketId: string;
  rating: number;
  comments: string;
  createdAt: string;
};

export const ViewFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await axios.get("http://localhost:3000/feedback");
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data);
      } catch (error) {
        // ignore
      }
    };
    fetchFeedback();
    fetchUsers();
  }, []);

  const getUserName = (userId: string) =>
    users.find((u: any) => String(u.id) === String(userId))?.name || userId;

  return (
    <Box sx={{ maxWidth: 1000, margin: "auto", mt: 5 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Customer Feedback
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Ticket ID</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Submitted At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedback.map((item: any) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#3e5c6d" }}>
                      {getUserName(item.userId)[0]?.toUpperCase()}
                    </Avatar>
                    <Typography>{getUserName(item.userId)}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{item.ticketId}</TableCell>
                <TableCell>
                  <Rating value={item.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  <Typography sx={{ whiteSpace: "pre-line" }}>
                    {item.comments}
                  </Typography>
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};