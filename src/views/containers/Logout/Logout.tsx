import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, Box } from "@mui/material";

export const Logout = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  useEffect(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    const timer = setTimeout(() => {
      setSnackbarOpen(false);
      navigate("/login");
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ "& .MuiSnackbarContent-root": { minWidth: 350, fontSize: 20 } }}
      >
        <Alert severity="info" sx={{ width: "100%", fontSize: 20, py: 3, justifyContent: "center" }}>
          You have been logged out.
        </Alert>
      </Snackbar>
    </Box>
  );
};