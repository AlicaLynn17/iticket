import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";
import "./SetPreferences.css";

export const SetPreferences = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  const [preferences, setPreferences] = useState({
    notifications: true,
    defaultView: "Open Tickets",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!userId) return;

    const fetchPreferences = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        setPreferences(response.data.preferences || {});
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setPreferences({ ...preferences, [name!]: value });
  };

  const handleSave = async () => {
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, { preferences });
      setSnackbar({ open: true, message: "Preferences updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Error updating preferences:", error);
      setSnackbar({ open: true, message: "Failed to update preferences.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  if (!userId) {
    return <Typography color="error">User not found. Please log in again.</Typography>;
  }

  return (
    <Box className="set-preferences-container">
      <div className="set-preferences-box">
        <h1 className="set-preferences-header">User Preferences</h1>

        <div className="section-label">Display Settings</div>

        <div className="form-group">
          <InputLabel sx={{ mb: 1 }}>Default Ticket View</InputLabel>
          <FormControl fullWidth size="small">
            <Select name="defaultView" value={preferences.defaultView} onChange={handleSelectChange}>
              <MenuItem value="Open Tickets">Open Tickets</MenuItem>
              <MenuItem value="All Tickets">All Tickets</MenuItem>
              <MenuItem value="Resolved Tickets">Resolved Tickets</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="form-group">
          <InputLabel sx={{ mb: 1 }}>Theme</InputLabel>
          <FormControl fullWidth size="small">
            <Select name="theme" value="system">
              <MenuItem value="light">Light</MenuItem>
              <MenuItem value="dark">Dark</MenuItem>
              <MenuItem value="system">System</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="section-label">Language & Region</div>

        <div className="form-group">
          <InputLabel sx={{ mb: 1 }}>Language</InputLabel>
          <FormControl fullWidth size="small">
            <Select name="language" value="en">
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="fil">Filipino</MenuItem>
              <MenuItem value="es">Spanish</MenuItem>
            </Select>
          </FormControl>
        </div>

        <div className="form-group">
          <InputLabel sx={{ mb: 1 }}>Timezone</InputLabel>
          <FormControl fullWidth size="small">
            <Select name="timezone" value="Asia/Manila">
              <MenuItem value="Asia/Manila">GMT+8:00 (Manila)</MenuItem>
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="America/New_York">GMT-5:00 (New York)</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Button className="save-button" onClick={handleSave}>
          Save Preferences
        </Button>

      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity as any}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
