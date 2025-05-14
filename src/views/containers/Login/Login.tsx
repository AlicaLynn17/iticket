import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, InputAdornment, IconButton, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.get("http://localhost:3000/users");
    const users = response.data;
    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password
    );
    if (user) {
      localStorage.setItem("authToken", "sampleToken");
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
    <Box sx={{
        minHeight: "95vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#fff"
      }}
    >
      {/* Left Side: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 4,
          py: 6,
          minWidth: 350,
          bgcolor: "#fff"
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
            <Box sx={{
              width: 36, height: 36, bgcolor: "#ffb072", borderRadius: 2, mr: 1,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Box sx={{
                width: 18, height: 18, bgcolor: "#3e5c6d", borderRadius: 1
              }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#29404a">
              ITicket
            </Typography>
          </Box>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, letterSpacing: 1 }}>
            WELCOME TO ITICKET
          </Typography>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Continue to your<br />Account.
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="EMAIL"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { bgcolor: "#f5f7fa", borderRadius: 2 }
              }}
              required
            />
            <TextField
              fullWidth
              label="PASSWORD"
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              InputProps={{
                sx: { bgcolor: "#f5f7fa", borderRadius: 2 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 700,
                bgcolor: "#29404a",
                "&:hover": { bgcolor: "#3e5c6d" }
              }}
            >
              CONTINUE&nbsp;&nbsp;→
            </Button>
          </form>
          <Typography sx={{ mt: 3, fontSize: 14 }}>
            New to ITicket? <Box component="span" sx={{ fontWeight: 700, textDecoration: "underline", cursor: "pointer" }}>GET STARTED</Box>
          </Typography>
        </Box>
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
      {/* Right Side: Geometric Pattern */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff"
        }}
      >
        <Box sx={{
          width: 400,
          height: 600,
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
          gap: 0
        }}>
          {/* Repeat these shapes to match your image */}
          {Array.from({ length: 24 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 100,
                height: 100,
                bgcolor: i % 4 === 0 ? "#ffb072" : i % 4 === 1 ? "#3e5c6d" : i % 4 === 2 ? "#cbe7f6" : "#3e5c6d",
                borderTopLeftRadius: i % 2 === 0 ? 40 : 0,
                borderTopRightRadius: i % 3 === 0 ? 40 : 0,
                borderBottomLeftRadius: i % 4 === 0 ? 40 : 0,
                borderBottomRightRadius: i % 5 === 0 ? 40 : 0,
                m: 0
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};