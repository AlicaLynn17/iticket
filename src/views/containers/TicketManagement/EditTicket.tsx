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
  const { id: ticketId } = useParams<{ id: string }>();
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
    createdBy: ""
  });

  const [users, setUsers] = useState<any[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

  const isCreator = formData.createdBy === loggedInUser.id;
  const isAdmin = loggedInUser.role === "Admin";

  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const ticketRes = await axios.get(`https://localhost:5001/api/Ticket/GetById/${ticketId}`);
      const usersRes = await axios.get("https://localhost:5001/api/Account/GetUsers");
      const t = ticketRes.data;
      setFormData({
        title: t.title || "",
        assignedTo: t.assignedTo ? t.assignedTo.toString() : "",
        dueDate: t.dueDate ? t.dueDate.split("T")[0] : "",
        description: t.description || "",
        category: t.category === "Hardware" || t.category === "Software" || t.category === "Network" || t.category === "Access/Account" || t.category === "Security" || t.category === "Other"
          ? t.category
          : "Other",
        priority: t.priority || "Medium",
        status: t.status || "Open",
        attachment: t.attachment || "",
        createdBy: t.createdBy || ""
      });
      if (
        t.category !== "Hardware" &&
        t.category !== "Software" &&
        t.category !== "Network" &&
        t.category !== "Access/Account" &&
        t.category !== "Security" &&
        t.category !== "Other"
      ) {
        setCustomCategory(t.category || "");
      } else {
        setCustomCategory("");
      }
      setUsers(usersRes.data);
    };

    fetchData();
  }, [ticketId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name!]: value });
    if (value !== "Other") {
      setCustomCategory("");
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!ticketId) {
    console.error("No ticket ID provided.");
    return;
  }

  try {
    await axios.put(`https://localhost:5001/api/Ticket/UpdateTicket/${ticketId}`, {
      ...formData,
      category: formData.category === "Other" ? customCategory : formData.category,
      id: parseInt(ticketId),
      assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
      createdBy: formData.createdBy ? parseInt(formData.createdBy) : null,
    });

    setSnackbar({
      open: true,
      message: "Ticket updated successfully!",
      severity: "success",
    });

    setTimeout(() => navigate("/view-tickets"), 1000);
  } catch (error) {
    console.error("Update error:", error);
    setSnackbar({
      open: true,
      message: "Failed to update ticket.",
      severity: "error",
    });
  }
    if (!ticketId) {
    console.error("No ticket ID provided.");
    return;
  }


  try {
    let attachmentFileName = formData.attachment;

    if (newAttachment) {
      const uploadData = new FormData();
      uploadData.append("file", newAttachment);

      const uploadRes = await axios.post(
        "https://localhost:5001/api/Ticket/UploadAttachment",
        uploadData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      attachmentFileName = uploadRes.data.fileName; 
    }

    await axios.put(`https://localhost:5001/api/Ticket/UpdateTicket/${ticketId}`, {
      ...formData,
      category: formData.category === "Other" ? customCategory : formData.category,
      id: parseInt(ticketId),
      assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
      createdBy: formData.createdBy ? parseInt(formData.createdBy) : null,
      attachment: attachmentFileName,
    });

    setSnackbar({
      open: true,
      message: "Ticket updated successfully!",
      severity: "success",
    });

    setTimeout(() => navigate("/view-tickets"), 1000);
  } catch (error) {
    console.error("Update error:", error);
    setSnackbar({
      open: true,
      message: "Failed to update ticket.",
      severity: "error",
    });
  }
};

const [newAttachment, setNewAttachment] = useState<File | null>(null);


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

          {!isCreator || isAdmin ? (
            <div className="form-group">
              <label>Assign to Agent</label>
              <FormControl fullWidth size="small">
                <Select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <MenuItem value="">Unassigned</MenuItem>
                  {users
                    .filter(user => user.role === "Admin" || user.role === "Agent")
                    .map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </MenuItem>
                  ))}

                </Select>
              </FormControl>
            </div>
          ) : null}

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
              multiline
              minRows={4}
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
            {formData.category === "Other" && (
              <TextField
                label="Specify Category"
                fullWidth
                size="small"
                value={customCategory}
                onChange={e => setCustomCategory(e.target.value)}
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
            <label>Attachment</label>
            {formData.attachment && !newAttachment && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2">
                  Current:{" "}
                  <a
                    href={`https://localhost:5001/uploads/${formData.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formData.attachment}
                  </a>
                </Typography>
                <Button
                  size="small"
                  color="error"
                  onClick={() => setFormData({ ...formData, attachment: "" })}
                >
                  Remove
                </Button>
              </Box>
            )}
            {/* Upload new attachment */}
            <Button
              variant="outlined"
              component="label"
              size="small"
              sx={{ mt: 1 }}
            >
              {newAttachment ? "Change File" : "Upload New"}
              <input
                type="file"
                hidden
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    setNewAttachment(e.target.files[0]);
                  }
                }}
              />
            </Button>
            {newAttachment && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected: {newAttachment.name}
                <Button
                  size="small"
                  color="error"
                  onClick={() => setNewAttachment(null)}
                  sx={{ ml: 1 }}
                >
                  Remove
                </Button>
              </Typography>
            )}
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
      autoHideDuration={3000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity as "success" | "error"}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>

    </Box>
  );
};
