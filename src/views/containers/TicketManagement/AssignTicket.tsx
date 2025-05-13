import React, { useEffect, useState } from "react";
import { Box, Button, Typography, MenuItem, Select, InputLabel, FormControl, Snackbar, Alert, Stack } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const AssignTicket = () => {
  const { id } = useParams(); // Ticket ID
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    // Fetch agents (users with role "agent")
    const fetchAgents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        const agentsList = response.data.filter((user: any) => user.role === "agent");
        setAgents(agentsList);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    // Fetch ticket details
    const fetchTicket = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/tickets/${id}`);
        setAssignedTo(response.data.assignedTo || "");
      } catch (error) {
        console.error("Error fetching ticket:", error);
      }
    };

    fetchAgents();
    fetchTicket();
  }, [id]);

  const handleAssign = async () => {
    try {
      await axios.patch(`http://localhost:3000/tickets/${id}`, { assignedTo });
      setSnackbar({ open: true, message: "Ticket assigned successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-tickets");
      }, 900);
    } catch (error) {
      console.error("Error assigning ticket:", error);
      setSnackbar({ open: true, message: "Failed to assign ticket.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Assign Ticket
      </Typography>
      <FormControl fullWidth margin="normal">
        <InputLabel>Assign To</InputLabel>
        <Select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          required
          label="Assign To"
        >
          {agents.map((agent: any) => (
            <MenuItem key={agent.id} value={agent.id}>
              {agent.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          onClick={() => navigate("/view-tickets")}
          type="button"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAssign}
        >
          Assign Ticket
        </Button>
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
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