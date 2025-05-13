import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate authentication (replace with real API call)
    if (credentials.email === "admin@example.com" && credentials.password === "password") {
      localStorage.setItem("authToken", "sampleToken"); // Save token to localStorage

      // Simulate user object (replace with real user data from API)
      const user = {
        id: "13ec",
        name: "Admin",
        email: credentials.email,
        role: "admin"
      };
      localStorage.setItem("user", JSON.stringify(user));

      setSnackbar({ open: true, message: "Login successful!", severity: "success" });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setSnackbar({ open: true, message: "Invalid email or password.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};