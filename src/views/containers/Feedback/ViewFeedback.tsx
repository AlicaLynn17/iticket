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
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import axios from "axios";
import "./ViewFeedback.css";

export const ViewFeedback = () => {
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackSeverity, setSnackSeverity] = useState<"success" | "error">("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);
  const [selectedTicketName, setSelectedTicketName] = useState<string>("");

  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [searchQuery, setSearchQuery] = useState("");

  const showNotification = (message: string, severity: "success" | "error") => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [feedbackRes, usersRes, ticketsRes, avgRes] = await Promise.all([
          axios.get("https://localhost:5001/api/Feedback/GetAll"),
          axios.get("https://localhost:5001/api/Account/GetUsers"),
          axios.get("https://localhost:5001/api/Ticket/GetTickets"),
          axios.get("https://localhost:5001/api/Feedback/GetAverageRating"),
        ]);
        setFeedbackList(feedbackRes.data);
        setUsers(usersRes.data);
        setTickets(ticketsRes.data);
        setAverageRating(avgRes.data.averageRating || 0);
      } catch (error) {
        console.error("Error fetching feedback data:", error);
        showNotification("Failed to load feedback.", "error");
      } finally {
        setLoading(false);
      }
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
      if (rating >= i) stars.push(<StarIcon key={i} sx={{ color: "#F89B5D" }} />);
      else if (rating >= i - 0.5) stars.push(<StarHalfIcon key={i} sx={{ color: "#F89B5D" }} />);
      else stars.push(<StarBorderIcon key={i} sx={{ color: "#F89B5D" }} />);
    }
    return <Stack direction="row" spacing={0.5}>{stars}</Stack>;
  };

  const openDeleteDialog = (id: number, ticketName: string) => {
    setSelectedFeedbackId(id);
    setSelectedTicketName(ticketName);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedFeedbackId) return;

    try {
      await axios.delete(
        `https://localhost:5001/api/Feedback/DeleteFeedback/${selectedFeedbackId}`
      );
      setFeedbackList((prev) => prev.filter((item) => item.id !== selectedFeedbackId));
      showNotification("Feedback deleted successfully!", "success");
    } catch {
      showNotification("Failed to delete feedback.", "error");
    }

    setOpenDialog(false);
  };

  const sortFeedback = (field: string) => {
    let sorted = [...feedbackList];
    if (field === "date") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
      });
    } else if (field === "user") {
      sorted.sort((a, b) => {
        const nameA = getUserName(a.userId || a.submittedBy).toLowerCase();
        const nameB = getUserName(b.userId || b.submittedBy).toLowerCase();
        return sortDirection === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    } else if (field === "rating") {
      sorted.sort((a, b) => {
        const rA = a.rating || 0;
        const rB = b.rating || 0;
        return sortDirection === "asc" ? rA - rB : rB - rA;
      });
    }
    setFeedbackList(sorted);
    setSortField(field);
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setSortAnchorEl(null);
  };

  const filteredFeedback = feedbackList.filter(
    (f) =>
      getUserName(f.userId || f.submittedBy).toLowerCase().includes(searchQuery.toLowerCase()) ||
      getTicketDescription(f.ticketId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box className="view-feedback-container">
      <div className="view-feedback-box">
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Customer Feedback</Typography>
          <Typography variant="subtitle1">Average Rating: {averageRating.toFixed(1)} ⭐</Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <TextField
            placeholder="Search user or ticket..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: "250px" }}
          />
          <IconButton onClick={(e) => setSortAnchorEl(e.currentTarget)}>
            <SortIcon />
          </IconButton>
        </Stack>

        <Box mb={2}>
          <Menu
            anchorEl={sortAnchorEl}
            open={Boolean(sortAnchorEl)}
            onClose={() => setSortAnchorEl(null)}
          >
            <MenuItem onClick={() => sortFeedback("user")}>Sort by User</MenuItem>
            <MenuItem onClick={() => sortFeedback("date")}>Sort by Date</MenuItem>
            <MenuItem onClick={() => sortFeedback("rating")}>Sort by Rating</MenuItem>
          </Menu>
        </Box>

        <Paper className="feedback-table-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Loading feedback...</p>
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell>Submitted At</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFeedback.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} style={{ textAlign: "center", height: "150px", color: "#888" }}>
                      No feedback found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFeedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{getTicketDescription(item.ticketId)}</TableCell>
                      <TableCell>{getUserName(item.userId || item.submittedBy)}</TableCell>
                      <TableCell>{renderStars(item.rating)}</TableCell>
                      <TableCell>{item.comments || item.content || "—"}</TableCell>
                      <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "N/A"}</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => openDeleteDialog(item.id, getTicketDescription(item.ticketId))}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </Paper>
      </div>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete feedback for:
            <br />
            <b>{selectedTicketName}</b>?
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackOpen}
        autoHideDuration={3000}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} variant="filled" sx={{ width: "100%" }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
