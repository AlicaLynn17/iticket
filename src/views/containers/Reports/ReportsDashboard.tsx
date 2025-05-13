import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { TicketSummary } from "./TicketSummary";
import { AgentPerformanceReport } from "./AgentPerformanceReport";
import "./ReportsDashboard.css";

export const ReportsDashboard = () => (
  <Box className="reports-dashboard-container">
    <div className="reports-dashboard-header">
      <h1>Reports & Analytics</h1>
    </div>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card">
          <Typography variant="h5" className="report-title">
            Ticket Summary
          </Typography>
          <TicketSummary />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className="report-card">
          <Typography variant="h5" className="report-title">
            Agent Performance Report
          </Typography>
          <AgentPerformanceReport />
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
