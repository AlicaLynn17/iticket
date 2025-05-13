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
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
      }, 900);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update user.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={formData.role}
            onChange={handleSelectChange}
            label="Role"
          >
            <MenuItem value="superadmin">Superadmin</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="agent">Agent</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate("/view-users")}
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
            Update User
          </Button>
        </Stack>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};