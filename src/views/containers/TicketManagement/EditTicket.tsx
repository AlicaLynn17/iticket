import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Snackbar,
  Alert
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export const EditTicket = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
    attachment: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/tickets/${id}`).then(res => setFormData(res.data));
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/tickets/${id}`, formData);
      setSnackbar({ open: true, message: "Ticket updated successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-tickets");
      }, 900);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update ticket.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">Edit Ticket</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={handleChange}
            fullWidth
            label="Issue Description"
            name="description"
            value={formData.description}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              label="Category"
            >
              <MenuItem value="Technical">Technical</MenuItem>
              <MenuItem value="Billing">Billing</MenuItem>
              <MenuItem value="General">General</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              label="Status"
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Attachment (URL)"
            name="attachment"
            value={formData.attachment}
            onChange={handleChange}
            margin="normal"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate("/view-tickets")}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Update Ticket
            </Button>
          </Stack>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={1500}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Box>
  );
};