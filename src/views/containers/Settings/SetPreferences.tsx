import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Switch, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Snackbar, Alert } from "@mui/material";
import axios from "axios";

export const SetPreferences = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;
  const [preferences, setPreferences] = useState({
    notifications: true,
    defaultView: "All Tickets",
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  if (!userId) {
    return <Typography color="error">User not found. Please log in again.</Typography>;
  }
  
  useEffect(() => {
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
    setPreferences({
      ...preferences,
      [name]: checked,
    });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setPreferences({
      ...preferences,
      [name!]: value,
    });
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

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h6" gutterBottom>
          Set Preferences
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Typography sx={{ flex: 1 }}>Enable Notifications</Typography>
          <Switch
              name="notifications"
              checked={preferences.notifications}
              onChange={handleChange} />
      </Box>
      <FormControl fullWidth margin="normal">
          <InputLabel shrink>Default Ticket View</InputLabel>
          <Select
              name="defaultView"
              value={preferences.defaultView}
              onChange={handleSelectChange}
          >
              <MenuItem value="All Tickets">All Tickets</MenuItem>
              <MenuItem value="Open Tickets">In Progress Tickets</MenuItem>
              <MenuItem value="Open Tickets">Open Tickets</MenuItem>
              <MenuItem value="Resolved Tickets">Resolved Tickets</MenuItem>
          </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSave}
        sx={{ mt: 2 }}
      >
        Save Preferences
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
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