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
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    status: "Open",
    attachment: "",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isUser = user.role === "user";

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
            label="Title"
            name="title"
            value={formData.title || ""}
            margin="dense"
            required
            inputProps={{ maxLength: 60 }}
          />
          <TextField
            onChange={handleChange}
            fullWidth
            label="Issue Description"
            name="description"
            value={formData.description}
            margin="dense"
            required
            multiline
            minRows={3}
            maxRows={6}
            inputProps={{ maxLength: 500 }}
          />
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                label="Category"
                size="small"
              >
                <MenuItem value="Hardware">Hardware</MenuItem>
                <MenuItem value="Software">Software</MenuItem>
                <MenuItem value="Network">Network</MenuItem>
                <MenuItem value="Access/Account">Access/Account</MenuItem>
                <MenuItem value="Email">Email</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                label="Priority"
                size="small"
              >
                <MenuItem value="Low">Low</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="High">High</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          {!isUser && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                label="Status"
                size="small"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Resolved">Resolved</MenuItem>
                <MenuItem value="Closed">Closed</MenuItem>
              </Select>
            </FormControl>
          )}
          {/* Attachment Drag-and-Drop */}
          <Box
            sx={{
              border: "2px dashed #3e5c6d",
              borderRadius: 2,
              p: 2,
              textAlign: "center",
              bgcolor: "#f5f5f5",
              color: "#29404a",
              my: 2,
              cursor: "pointer",
              transition: "background 0.2s",
              minHeight: 90,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center"
            }}
            onClick={() => document.getElementById("edit-attachment-input")?.click()}
          >
            <Typography fontWeight="bold" mb={0.5}>Attachments</Typography>
            <Typography variant="body2" color="textSecondary" sx={{ fontSize: 13 }}>
              Click to change or upload a file (current: {formData.attachment || "None"})
            </Typography>
            <input
              id="edit-attachment-input"
              type="file"
              style={{ display: "none" }}
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setFormData({ ...formData, attachment: e.target.files[0].name });
                }
              }}
            />
            {formData.attachment && (
              <Typography sx={{ mt: 1, fontSize: 13 }}>{formData.attachment}</Typography>
            )}
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => navigate("/view-tickets")}
              type="button"
              sx={{ textTransform: "none" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ textTransform: "none" }}
            >
              Update Ticket
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};