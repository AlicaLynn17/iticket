import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AssignTicket.css";

export const AssignTicket = () => {
  const { id } = useParams(); // Ticket ID
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users");
        setAgents(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    const fetchTicket = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/tickets/${id}`);
        setAssignedTo(res.data.assignedTo || "");
      } catch (err) {
        console.error("Error fetching ticket:", err);
      }
    };

    fetchUsers();
    fetchTicket();
  }, [id]);


  const handleAssign = async () => {
    try {
      await axios.patch(`http://localhost:3000/tickets/${id}`, { assignedTo });
      setSnackbar({ open: true, message: "Ticket assigned successfully!", severity: "success" });
      setTimeout(() => navigate("/view-tickets"), 1000);
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to assign ticket.", severity: "error" });
    }
  };

  return (
    <Box className="assign-ticket-container">
      <div className="assign-ticket-box">
        <h1>Assign Ticket</h1>
        <h2>Select an agent to assign this ticket to</h2>
        <FormControl fullWidth size="small" className="form-group">
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
          <Button variant="outlined" fullWidth onClick={() => navigate("/view-tickets")}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth onClick={handleAssign}>
            Assign Ticket
          </Button>
        </Stack>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1000}
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
