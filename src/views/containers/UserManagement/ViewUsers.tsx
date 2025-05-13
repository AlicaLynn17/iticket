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
import VisibilityIcon from "@mui/icons-material/Visibility";
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

  useEffect(() => {
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
    axios.get("http://localhost:3000/tickets").then((res) => setTickets(res.data));
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

  const handleDelete = async (user: any) => {
    setDeleteDialogOpen(false);
    try {
      await axios.delete(`http://localhost:3000/users/${user.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Failed to delete user.", severity: "error" });
    }
  };

  const handleConfirmDelete = () => {
    if (userToDelete) handleDelete(userToDelete);
  };

  return (
    <Box className="view-users-container">
      <div className="view-users-header">
        <h1>Users Dashboard</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/add-user")}
        >
          New User
        </Button>
      </div>

      <Paper className="user-table-paper">
        <Typography variant="h6" className="table-title">User List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Tickets</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{getTicketsAssignedCount(user.id)}</TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => handleDialogOpen(user)}><VisibilityIcon /></IconButton>
                  <IconButton color="info" onClick={() => handleEdit(user)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => { setUserToDelete(user); setDeleteDialogOpen(true); }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* User Dialog */}
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
              <Typography><b>Name:</b> {selectedUser.name}</Typography>
              <Typography><b>Email:</b> {selectedUser.email}</Typography>
              <Typography><b>Role:</b> {selectedUser.role}</Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: "flex-end" }}>
          <Button variant="outlined" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>Delete</Button>
        </Stack>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
