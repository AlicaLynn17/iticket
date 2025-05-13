import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { TicketSummary } from "./TicketSummary";
import { AgentPerformanceReport } from "./AgentPerformanceReport";

export const ReportsDashboard = () => (
  <Box sx={{ maxWidth: 1200, margin: "auto", mt: 5 }}>
    <Typography variant="h4" sx={{ mb: 3 }}>
      Reports & Analytics
    </Typography>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Ticket Summary
          </Typography>
          <TicketSummary />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Agent Performance Report
          </Typography>
          <AgentPerformanceReport />
        </Paper>
      </Grid>
    </Grid>
  </Box>
);