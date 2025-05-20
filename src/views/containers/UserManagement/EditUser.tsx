import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  MenuItem,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import "./EditUser.css";

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: ""
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    axios.get(`http://localhost:3000/users/${id}`).then(res => setFormData(res.data));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/users/${id}`, formData);
      setSnackbar({ open: true, message: "User updated successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-users");
      }, 1000);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update user.", severity: "error" });
    }
  };

  return (
    <Box className="edit-user-container">
      <div className="edit-user-box">
        <h1>Edit User</h1>
        <h2>Modify user information below</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
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
                <MenuItem value="agent">Agent</MenuItem>
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
              size="small"
            />
          </div>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/view-users")}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
            >
              Update User
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
