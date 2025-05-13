import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Stack,
  Paper,
  Chip,
  Grid,
  IconButton,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Snackbar
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FeedbackIcon from "@mui/icons-material/Feedback";
import UpdateIcon from "@mui/icons-material/Update";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const getAssignedUserName = (userId: string, users: any[]) => {
  const user = users.find(u => u.id === userId);
  return user ? user.name : "Unassigned";
};

export const ViewTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios.get("http://localhost:3000/tickets").then(res => setTickets(res.data));
    axios.get("http://localhost:3000/users").then(res => setUsers(res.data));
  }, []);

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    if (ticketToDelete) {
      try {
        await axios.delete(`http://localhost:3000/tickets/${ticketToDelete.id}`);
        setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
        setSnackbar({ open: true, message: "Ticket deleted successfully!", severity: "success" });
      } catch {
        setSnackbar({ open: true, message: "Failed to delete ticket.", severity: "error" });
      }
      setTicketToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setTicketToDelete(null);
  };

  // Dashboard summary (example: you can expand this)
  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const closedTickets = tickets.filter((t) => t.status === "Closed").length;
  const highPriority = tickets.filter((t) => t.priority === "High").length;

  return (
    <Box sx={{ maxWidth: 1100, margin: "auto", mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Ticket Dashboard</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-ticket")}
        >
          New Ticket
        </Button>
      </Stack>

      {/* Dashboard Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AssignmentIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="subtitle1">Total Tickets</Typography>
            <Typography variant="h5">{totalTickets}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AssignmentIndIcon color="warning" sx={{ fontSize: 32 }} />
            <Typography variant="subtitle1">Open</Typography>
            <Typography variant="h5">{openTickets}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <UpdateIcon color="success" sx={{ fontSize: 32 }} />
            <Typography variant="subtitle1">Closed</Typography>
            <Typography variant="h5">{closedTickets}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AssignmentIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="subtitle1">High Priority</Typography>
            <Typography variant="h5">{highPriority}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Ticket List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell> 
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={
                      ticket.priority === "High"
                        ? "error"
                        : ticket.priority === "Medium"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    color={ticket.status === "Closed" ? "success" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {ticket.assignedTo
                    ? getAssignedUserName(ticket.assignedTo, users)
                    : "Unassigned"}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/assign-ticket/${ticket.id}`)}
                    title="Assign"
                  >
                    <AssignmentIndIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => navigate(`/edit-ticket/${ticket.id}`)}
                    title="Edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => navigate(`/collect-feedback/${ticket.id}`)}
                    title="Feedback"
                  >
                    <FeedbackIcon />
                  </IconButton>
                <IconButton
                  color="error"
                  onClick={() => {
                    setTicketToDelete(ticket);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this ticket?
        </Typography>
      </DialogContent>
      <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button onClick={handleCancelDelete} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleConfirmDelete} color="error" variant="contained">
          Delete
        </Button>
      </Stack>
    </Dialog>
    <Snackbar
      open={snackbar.open}
      autoHideDuration={1500}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity as any}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </Box>
  );
};