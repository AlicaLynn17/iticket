import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddUser.css";

export const AddUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
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
    try {
      await axios.post("http://localhost:3000/users", formData);
      setSnackbar({ open: true, message: "User added successfully!", severity: "success" });
      setFormData({
        name: "",
        email: "",
        role: "",
        password: "",
      });
      setTimeout(() => navigate("/view-users"), 1000);
    } catch {
      setSnackbar({ open: true, message: "Failed to add user.", severity: "error" });
    }
  };

  return (
    <Box className="add-user-container">
      <div className="add-user-box">
        <h1>Add User</h1>
        <h2>Fill in the details to register a new user</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <FormControl fullWidth size="small">
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                required
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="form-group">
            <label>Password</label>
            <TextField
              fullWidth
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
            />
          </div>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => navigate("/view-users")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Add User
            </Button>
          </Stack>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
