import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Stack,
  Typography
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditTicket.css";

export const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    assignedTo: "",
    dueDate: "",
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
    attachment: "",
  });

  const [users, setUsers] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      const ticketRes = await axios.get(`http://localhost:3000/tickets/${id}`);
      const usersRes = await axios.get("http://localhost:3000/users");
      setFormData(ticketRes.data);
      setUsers(usersRes.data);
    };

    fetchData();
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
            <label>Title</label>
            <TextField
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Assign to Agent</label>
            <FormControl fullWidth size="small">
              <Select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
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
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </div>

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
                <MenuItem value="Hardware">Hardware</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
                <MenuItem value="Access/Account">Access/Account</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
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
            <label>Attachments</label>
            <Box className="drop-zone">
              <Typography variant="body2" color="textSecondary">
                Drag & drop files here or click to upload
              </Typography>
            </Box>
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
    </Box>
  );
};
