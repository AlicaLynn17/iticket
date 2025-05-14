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
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    attachment: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [dragActive, setDragActive] = useState(false);
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

  // Drag and drop handlers for attachment
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // For demo, just store the file name. You can upload the file if needed.
      setFormData({ ...formData, attachment: e.dataTransfer.files[0].name });
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, attachment: e.target.files[0].name });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const newTicket = {
      ...formData,
      status: "Open",
      assignedTo: null,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      createdBy: user.id,
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
  <Box sx={{ maxWidth: 480, margin: "40px auto" }}>
    <Paper sx={{ p: 2.5, borderRadius: 3, boxShadow: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={1.5}>
        Add New Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          onChange={handleInputChange}
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          margin="dense"
          required
          inputProps={{ maxLength: 60 }}
        />
        <TextField
          onChange={handleInputChange}
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
              onChange={handleSelectChange}
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
              onChange={handleSelectChange}
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
        {/* Attachment Drag-and-Drop */}
        <Box
          sx={{
            border: "2px dashed #3e5c6d",
            borderRadius: 2,
            p: 2,
            textAlign: "center",
            bgcolor: dragActive ? "#e3f2fd" : "#f5f5f5",
            color: "#29404a",
            my: 2,
            cursor: "pointer",
            transition: "background 0.2s",
            minHeight: 90,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("attachment-input")?.click()}
        >
          <Typography fontWeight="bold" mb={0.5}>Attachments</Typography>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: 13 }}>
            Drag a file here or choose a file to upload
          </Typography>
          <input
            id="attachment-input"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
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
}