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
  Paper
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";


export const ViewUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then((response) => setUsers(response.data));
    axios.get("http://localhost:3000/tickets")
      .then((response) => setTickets(response.data));
  }, []);

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
    handleDialogClose();
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:3000/users/${user.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
      } catch {
        setSnackbar({ open: true, message: "Failed to delete user.", severity: "error" });
      }
    }
  };

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    if (userToDelete) {
      try {
        await axios.delete(`http://localhost:3000/users/${userToDelete.id}`);
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        setSnackbar({ open: true, message: "User deleted successfully!", severity: "success" });
      } catch {
        setSnackbar({ open: true, message: "Failed to delete user.", severity: "error" });
      }
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const getTicketsAssignedCount = (userId: string) =>
  tickets.filter(ticket => ticket.assignedTo === userId).length;
  

  return (
    <Box sx={{ maxWidth: 1100, margin: "auto", mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Users Dashboard</Typography>
        {/* Conditionally render Add User button for admin */}
        {user.role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
            startIcon={<AddIcon />}
            onClick={() => navigate("/add-user")}
          >
            New User
          </Button>
        )}
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          User List
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Tickets Assigned</TableCell>
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
                <TableCell>
                  {getTicketsAssignedCount(user.id)}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="info" onClick={() => handleEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => {
                  setUserToDelete(user);
                  setDeleteDialogOpen(true);
                }}>
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
            Are you sure you want to delete this user?
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