import React, { useState } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const CreateTicket = () => {
  const [formData, setFormData] = useState({
    description: "",
    category: "",
    priority: "Medium",
    attachment: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = {
      ...formData,
      status: "Open",
      assignedTo: null,
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };
    try {
      await axios.post("http://localhost:3000/tickets", newTicket);
      setSnackbar({ open: true, message: "Ticket created successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-tickets");
      }, 900);
    } catch (error) {
      console.error("Error creating ticket:", error);
      setSnackbar({ open: true, message: "Failed to create ticket.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 5 }}>
      <Paper sx={{ p: 3 }}>
          <Typography variant="h5">Add New Ticket</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            onChange={handleInputChange}
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
              onChange={handleSelectChange}
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
              onChange={handleSelectChange}
              required
              label="Priority"
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Attachment (URL)"
            name="attachment"
            value={formData.attachment}
            onChange={handleInputChange}
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
              Submit Ticket
            </Button>
          </Stack>
        </form>
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
      </Paper>
    </Box>
  );
};