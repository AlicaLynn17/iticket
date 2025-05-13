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
import "./EditTicket.css";

export const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
    attachment: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

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
      setTimeout(() => navigate("/view-tickets"), 1000);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update ticket.", severity: "error" });
    }
  };

  return (
    <Box className="edit-ticket-container">
      <div className="edit-ticket-box">
        <h1>Edit Ticket</h1>
        <h2>Update ticket details below</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Issue Description</label>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <FormControl fullWidth size="small">
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <MenuItem value="Technical">Technical</MenuItem>
                <MenuItem value="Billing">Billing</MenuItem>
                <MenuItem value="General">General</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Priority</label>
            <FormControl fullWidth size="small">
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Status</label>
            <FormControl fullWidth size="small">
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Attachment (URL)</label>
            <TextField
              fullWidth
              name="attachment"
              value={formData.attachment}
              onChange={handleChange}
              size="small"
            />
          </div>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/view-tickets")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Update Ticket
            </Button>
          </Stack>
        </form>
      </div>

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
