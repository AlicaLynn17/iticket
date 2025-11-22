import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from "axios";
import "./SetPreferences.css";

export const SetPreferences = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user.id;

  const [preferences, setPreferences] = useState({
    showStats: true,
    showSatisfaction: true,
    cardOrder: ["unresolved", "overdue", "dueToday", "resolved"],
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (!userId) return;
    const fetchPrefs = async () => {
      try {
        const res = await axios.get(`https://localhost:5001/api/preference/${userId}`);
        if (res.data) {
          setPreferences(res.data);
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
      }
    };
    fetchPrefs();
  }, [userId]);

  const handleToggle = (name: string) => {
    setPreferences((prev) => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(preferences.cardOrder);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setPreferences((prev) => ({ ...prev, cardOrder: newOrder }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://localhost:5001/api/preference/${userId}`, {
        userId,
        showStats: preferences.showStats,
        showSatisfaction: preferences.showSatisfaction,
        cardOrder: preferences.cardOrder, 
      });
      setSnackbar({
        open: true,
        message: "Dashboard preferences saved!",
        severity: "success",
      });
    } catch (err) {
      console.error("Error saving preferences:", err);
      setSnackbar({
        open: true,
        message: "Failed to save preferences.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const statLabels: Record<string, string> = {
    unresolved: "Unresolved",
    overdue: "Overdue",
    dueToday: "Due Today",
    resolved: "Resolved",
  };

  return (
    <Box className="set-preferences-container">
      <div className="set-preferences-box">
        <h1 className="set-preferences-header">Settings and Preferences</h1>

        <Typography sx={{ mb: 2, color: "gray" }}>
          Choose what sections to show and reorder your cards.
        </Typography>

<div className="switches-container">
  <div className="switch-box">
    <FormControlLabel
      control={
        <Switch
          checked={preferences.showStats}
          onChange={() => handleToggle("showStats")}
        />
      }
      label="Show Ticket Statistics"
    />
  </div>

  <div className="switch-box">
    <FormControlLabel
      control={
        <Switch
          checked={preferences.showSatisfaction}
          onChange={() => handleToggle("showSatisfaction")}
        />
      }
      label="Show Customer Satisfaction"
    />
  </div>
</div>


        <Typography sx={{ mt: 3, mb: 1, fontWeight: "bold" }}>
          Default View
        </Typography>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stats">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="drag-container"
              >
                {preferences.cardOrder.map((key, index) => (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="draggable-item"
                      >
                        {statLabels[key]}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button className="save-button"
          sx={{ mt: 2 }}
          variant="contained"
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity as any}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
