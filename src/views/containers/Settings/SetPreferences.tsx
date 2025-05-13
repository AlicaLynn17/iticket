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
        <h1>User Preferences</h1>
        <div className="form-group switch-row">
          <Typography>Enable Notifications</Typography>
          <Switch
            name="notifications"
            checked={preferences.notifications}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <InputLabel sx={{ mb: 1 }}>Default Ticket View</InputLabel>
          <FormControl fullWidth size="small">
            <Select
              name="defaultView"
              value={preferences.defaultView}
              onChange={handleSelectChange}
            >
              <MenuItem value="Open Tickets">Open Tickets</MenuItem>
              <MenuItem value="All Tickets">All Tickets</MenuItem>
              <MenuItem value="Resolved Tickets">Resolved Tickets</MenuItem>
            </Select>
          </FormControl>
        </div>
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSave}>
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
