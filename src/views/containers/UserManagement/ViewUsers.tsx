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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Stack,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewUsers.css";

export const ViewUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [hasOpenTickets, setHasOpenTickets] = useState(false);

useEffect(() => {
  axios
    .get("https://localhost:5001/api/Account/GetUsers")
    .then((res) => {
      setUsers(res.data);
    })
    .catch((err) => {
      console.error("Failed to fetch users:", err);
    });

   axios.get("https://localhost:5001/api/Ticket/GetTickets").then((res) => setTickets(res.data));
}, []);


  const getTicketsAssignedCount = (userId: string) =>
    tickets.filter((ticket) => ticket.assignedTo === userId).length;

  const handleDialogOpen = (user: any) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleEdit = (user: any) => {
    handleDialogClose();
    navigate(`/edit-user/${user.id}`);
  };

  const handleDeleteClick = (user: any) => {
    const openOrInProgress = tickets.some(
      (ticket) =>
        ticket.assignedTo === user.id &&
        (ticket.status === "Open" || ticket.status === "In Progress")
    );
    setHasOpenTickets(openOrInProgress);
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async (user: any) => {
    try {
      
      const affectedTickets = tickets.filter(
        (ticket) => ticket.assignedTo === user.id
      );
       for (const ticket of affectedTickets) {
        await axios.put(`https://localhost:5001/api/Ticket/UnassignTicket/Unassign/${ticket.id}`);
      }


      await axios.delete(`https://localhost:5001/api/Account/DeleteUser/${user.id}`, { withCredentials: true });
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.assignedTo === user.id ? { ...ticket, assignedTo: "" } : ticket
        )
      );
      setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete user.", severity: "error" });
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) handleDelete(userToDelete);
  };

  return (
    <Box className="view-users-container">
      <div className="view-users-header">
        <h1>Users Dashboard</h1>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/add-user")}>
          New User
        </Button>
      </div>

      <div className="user-filters-toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="user-search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="user-role-select"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Agent">Agent</option>
          <option value="User">User</option>
        </select>
      </div>

      <Paper className="user-table-paper">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .filter(
                (user) =>
                  user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .filter((user) => (roleFilter ? user.role === roleFilter : true))
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{getTicketsAssignedCount(user.id)}</TableCell>
                  <TableCell align="center">
                    <IconButton color="info" onClick={() => handleEdit(user)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDeleteClick(user)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          User Details
          <IconButton onClick={handleDialogClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Typography><b>Full Name:</b> {selectedUser.name}</Typography>
              <Typography><b>Email:</b> {selectedUser.email}</Typography>
              <Typography><b>Role:</b> {selectedUser.role}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {hasOpenTickets
              ? "This user has open or in-progress tickets. Deleting them will unassign those tickets. Are you sure you want to continue?"
              : "Are you sure you want to delete this user?"}
          </Typography>
        </DialogContent>
        <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>
            No
          </Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Yes
          </Button>
        </Stack>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
