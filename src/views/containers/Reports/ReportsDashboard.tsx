import React from "react";
import { Box, Grid, Paper, Typography, Divider, LinearProgress } from "@mui/material";
import "./ReportsDashboard.css";

export const ReportsDashboard = () => (
  <Box className="reports-dashboard-container">
    <div className="reports-dashboard-header">
      <h1>Reports & Analytics</h1>
      <h2>Visual insights into system performance, ticket trends, and agent efficiency</h2>
    </div>

    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card">
          <Typography variant="h5" className="report-title">Ticket Breakdown</Typography>
          <Divider sx={{ mb: 2 }} />

          <div className="report-metric">
            <span className="report-label">Total Tickets</span>
            <span className="report-value">384</span>
          </div>
          <div className="report-metric">
            <span className="report-label">Resolved</span>
            <span className="report-value">271</span>
            <LinearProgress variant="determinate" value={71} />
          </div>
          <div className="report-metric">
            <span className="report-label">In Progress</span>
            <span className="report-value">89</span>
            <LinearProgress variant="determinate" value={23} color="warning" />
          </div>
          <div className="report-metric">
            <span className="report-label">Overdue</span>
            <span className="report-value">24</span>
            <LinearProgress variant="determinate" value={6} color="error" />
          </div>
        </Paper>
      </Grid>

      {/* Agent Stats Section */}
      <Grid item xs={12} md={6}>
        <Paper className="report-card">
          <Typography variant="h5" className="report-title">Agent Highlights</Typography>
          <Divider sx={{ mb: 2 }} />

          <div className="report-metric">
            <span className="report-label">Top Performer</span>
            <span className="report-value">Bianca Cruz</span>
          </div>
          <div className="report-metric">
            <span className="report-label">Tickets Handled</span>
            <span className="report-value">142</span>
          </div>
          <div className="report-metric">
            <span className="report-label">Avg. Resolution Time</span>
            <span className="report-value">2.4 days</span>
          </div>
          <div className="report-metric">
            <span className="report-label">Customer Satisfaction</span>
            <span className="report-value">94%</span>
            <LinearProgress variant="determinate" value={94} color="success" />
          </div>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
