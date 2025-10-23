import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  FormControl,
  MenuItem,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import "./EditUser.css";

type UserFormData = {
  name?: string;
  email?: string;
  role?: string;
  password?: string;
};

export const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Load existing user data
  useEffect(() => {
    axios
      .get(`https://localhost:5001/api/account/GetUser/${id}`, {
        withCredentials: true,
      })
      .then((res) => setFormData(res.data))
      .catch(() =>
        setSnackbar({
          open: true,
          message: "Failed to load user data.",
          severity: "error",
        })
      );
  }, [id]);

  // ✅ Handle text input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle role selection
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const password = formData.password ?? ""; // fallback to empty string

  // ✅ Only validate if password is provided
  if (password.trim() !== "" && password.length < 7) {
    setSnackbar({
      open: true,
      message: "Password must be at least 7 characters long!",
      severity: "error",
    });
    return;
  }

  // ✅ Only include password if provided
  const updatedUser = { ...formData };
  if (!password.trim()) {
    delete updatedUser.password;
  }

  try {
    await axios.put(
      `https://localhost:5001/api/account/UpdateUser/${id}`,
      updatedUser,
      { withCredentials: true }
    );

    setSnackbar({
      open: true,
      message: "User updated successfully!",
      severity: "success",
    });

    setTimeout(() => navigate("/view-users"), 1000);
  } catch {
    setSnackbar({
      open: true,
      message: "Failed to update user.",
      severity: "error",
    });
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
              value={formData.name || ""}
              onChange={handleChange}
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <TextField
              fullWidth
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleChange}
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <FormControl fullWidth size="small">
              <Select
                name="role"
                value={formData.role || ""}
                onChange={handleSelectChange}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Agent">Agent</MenuItem>
                <MenuItem value="User">User</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div className="form-group">
            <label>Password</label>
            <TextField
              fullWidth
              name="password"
              type="password"
              value={formData.password || ""}
              onChange={handleChange}
              size="small"
              placeholder="Enter new password (optional)"
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
            <Button type="submit" variant="contained" fullWidth>
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
