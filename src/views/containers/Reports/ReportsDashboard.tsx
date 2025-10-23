import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";
import axios from "axios";
import "./ReportsDashboard.css";

type Ticket = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  assignedTo?: string;
  dueDate?: string;
  status: string;
  createdAt: string;
  resolvedAt?: string | null;
  createdBy: string;
};

export const ReportsDashboard = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get<Ticket[]>("http://localhost:3000/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // --- Compute ticket stats ---
  const totalTickets = tickets.length;
  const resolved = tickets.filter(
    (t) => t.status?.toLowerCase() === "resolved" || t.status?.toLowerCase() === "closed"
  ).length;
  const inProgress = tickets.filter((t) => t.status?.toLowerCase() === "in progress").length;
  const open = tickets.filter((t) => t.status?.toLowerCase() === "open").length;
  const overdue = tickets.filter((t) => t.status?.toLowerCase() === "overdue").length;

  // --- Compute category and priority breakdown ---
  const countBy = (key: keyof Ticket) =>
    tickets.reduce<Record<string, number>>((acc, t) => {
      const value = t[key] || "Uncategorized";
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

  const ticketsByCategory = countBy("category");
  const ticketsByPriority = countBy("priority");

  return (
    <Box className="reports-dashboard-container">
      <div className="reports-dashboard-header">
        <h1>Reports & Analytics</h1>
        <h2>Visual insights into system performance, ticket trends, and agent efficiency</h2>
      </div>

      {loading ? (
        <Typography variant="body1" sx={{ mt: 3 }}>
          Loading data...
        </Typography>
      ) : (
        <Grid container spacing={3} direction="column">
  {/* Ticket Breakdown */}
  <Grid item xs={12}>
    <Paper className="report-card">
      <Typography variant="h5" className="report-title">
        Ticket Breakdown
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell align="right">Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Total Tickets</TableCell>
            <TableCell align="right">{totalTickets}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Resolved / Closed</TableCell>
            <TableCell align="right">{resolved}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>In Progress</TableCell>
            <TableCell align="right">{inProgress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Open</TableCell>
            <TableCell align="right">{open}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Overdue</TableCell>
            <TableCell align="right">{overdue}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  </Grid>

  {/* Tickets by Category */}
  <Grid item xs={12}>
    <Paper className="report-card">
      <Typography variant="h5" className="report-title">
        Tickets by Category
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell align="right">Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(ticketsByCategory).map(([category, count]) => (
            <TableRow key={category}>
              <TableCell>{category}</TableCell>
              <TableCell align="right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Grid>

  {/* Tickets by Priority */}
  <Grid item xs={12}>
    <Paper className="report-card">
      <Typography variant="h5" className="report-title">
        Tickets by Priority
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Priority</TableCell>
            <TableCell align="right">Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(ticketsByPriority).map(([priority, count]) => (
            <TableRow key={priority}>
              <TableCell>{priority}</TableCell>
              <TableCell align="right">{count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </Grid>
</Grid>

      )}
    </Box>
  );
};
