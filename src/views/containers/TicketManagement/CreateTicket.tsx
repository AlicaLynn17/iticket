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
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateTicket.css";

export const CreateTicket = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    attachment: "",
    assignedTo: "",
    dueDate: "" 
  });

  const [users, setUsers] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/users").then(res => setUsers(res.data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newTicket = {
      ...formData,
      status: "Open",
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };

    try {
      await axios.post("http://localhost:3000/tickets", newTicket);
      setSnackbar({ open: true, message: "Ticket created successfully!", severity: "success" });
      setTimeout(() => navigate("/view-tickets"), 1000);
    } catch (error) {
      console.error("Error creating ticket:", error);
      setSnackbar({ open: true, message: "Failed to create ticket.", severity: "error" });
    }
  };

  return (
    <Box className="create-ticket-container">
      <div className="create-ticket-box">
        <h1>Create Ticket</h1>
        <h2>Fill in the details to submit an issue</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">

            <div className="form-group">
            <label>Ticket Title</label>
            <TextField
              fullWidth
              name="title"
              value={formData.title || ""}
              onChange={handleInputChange}
              required
              size="small"
            />
          </div>

            <label>Issue Description</label>
            <TextField
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleInputChange}
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
                onChange={handleSelectChange}
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
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Assign to Agent</label>
            <FormControl fullWidth size="small">
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleSelectChange}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <TextField
              fullWidth
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              size="small"
              required
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="form-group">
            <label>Attachments</label>
            <Box className="drop-zone">
              <Typography variant="body2" color="textSecondary">
                Drag & drop files here or click to upload
              </Typography>
            </Box>
          </div>


          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/view-tickets")}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Submit Ticket
            </Button>
          </Stack>
        </form>
      </div>
    </Box>
  );
};
