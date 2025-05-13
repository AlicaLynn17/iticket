import React, { useState } from "react";
import {
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data;

      const matchedUser = users.find(
        (user: any) =>
          user.email === credentials.email &&
          user.password === credentials.password
      );

      if (matchedUser) {
        localStorage.setItem("authToken", "sampleToken");
        localStorage.setItem("user", JSON.stringify(matchedUser));

        setSnackbar({
          open: true,
          message: "Login successful!",
          severity: "success",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setSnackbar({
          open: true,
          message: "Invalid email or password.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbar({
        open: true,
        message: "Server error. Please try again later.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ ...snackbar, open: false });

  return (
    <div className="login-container">
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <h1>ITicket</h1>
          <h3>Welcome Back!</h3>
          <h2>Continue to your Account.</h2>

         <label htmlFor="email">Email</label>
          <TextField
            className="field"
            fullWidth
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <TextField
            className="field"
            fullWidth
            name="password"
            type="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Login</button>

          <div className="bottom-text">
            Don’t have an account? <a href="/signup">Sign up</a>
          </div>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};
