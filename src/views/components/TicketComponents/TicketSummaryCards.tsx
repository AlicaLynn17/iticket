import React from "react";
import { Grid, Paper } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import UpdateIcon from "@mui/icons-material/Update";

interface TicketSummaryCardsProps {
  total: number;
  open: number;
  closed: number;
  highPriority: number;
}

export const TicketSummaryCards: React.FC<TicketSummaryCardsProps> = ({
  total,
  open,
  closed,
  highPriority,
}) => {
  return (
    <Grid container spacing={2} className="ticket-summary">
      <Grid item xs={12} sm={6} md={3}>
        <Paper className="summary-card">
          <AssignmentIcon className="summary-icon primary" />
          <p className="summary-label">Total Tickets</p>
          <p className="summary-count">{total}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className="summary-card">
          <AssignmentIndIcon className="summary-icon warning" />
          <p className="summary-label">Open</p>
          <p className="summary-count">{open}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className="summary-card">
          <UpdateIcon className="summary-icon success" />
          <p className="summary-label">Closed</p>
          <p className="summary-count">{closed}</p>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper className="summary-card">
          <AssignmentIcon className="summary-icon error" />
          <p className="summary-label">High Priority</p>
          <p className="summary-count">{highPriority}</p>
        </Paper>
      </Grid>
    </Grid>
  );
};
