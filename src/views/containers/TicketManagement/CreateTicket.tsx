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
  const [dragActive, setDragActive] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdminOrAgent = user.role === "admin" || user.role === "superadmin" || user.role === "agent";
  const [customCategory, setCustomCategory] = useState("");

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
      category: formData.category === "Other" ? customCategory : formData.category,
      status: "Open",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      createdBy: user.id,
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

  return (
    <form onSubmit={handleSubmit}>
      <Box className="create-ticket-container">
        <div className="create-ticket-box">
          <h1>Create Ticket</h1>
          <h2>Fill in the details to submit an issue</h2>
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
                multiline
                rows={4}
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
                  size="small"
                >
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Billing">Billing</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>

              {formData.category === "Other" && (
                <TextField
                  label="Specify Category"
                  fullWidth
                  size="small"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  sx={{ mt: 1 }}
                  required
                />
              )}
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
              {isAdminOrAgent && (
                <>
                  <label>Assign to Agent</label>
                  <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                    <InputLabel id="assignedTo-label">Assign To</InputLabel>
                    <Select
                      labelId="assignedTo-label"
                      name="assignedTo"
                      value={formData.assignedTo}
                      label="Assign To"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {users
                        .filter(user => user.role === "agent" || user.role === "admin")
                        .map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name} ({user.role})
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </>
              )}
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
              <Box className="drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("attachment-input")?.click()}
              >
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
        </div>
      </Box>
    </form>
  );
};
