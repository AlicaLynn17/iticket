import { Box, Grid, Paper, Typography, Divider, LinearProgress, Stack, Button } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user.role === "user") {
      navigate("/view-tickets", { replace: true });
    }
  }, [user, navigate]);

  // Mock data for demonstration
  const stats = {
    unresolved: 5,
    overdue: 2,
    dueToday: 3,
    resolved: 12,
    avgResolutionTime: "4h 30m",
    satisfaction: {
      positive: 80,
      neutral: 15,
      negative: 5,
    },
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1300, margin: "auto" }}>
        {user.name && (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Welcome, {user.name}!
        </Typography>
      )}
      <Typography variant="h4" gutterBottom>
        ITicket Help Desk Dashboard
      </Typography>
      {/* Role-based action buttons */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Ticket Stats */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Unresolved</Typography>
            <Typography variant="h4">{stats.unresolved}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <ErrorOutlineIcon color="error" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Overdue</Typography>
            <Typography variant="h4">{stats.overdue}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AccessTimeIcon color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Due Today</Typography>
            <Typography variant="h4">{stats.dueToday}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: "center" }}>
            <AssignmentTurnedInIcon color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Resolved</Typography>
            <Typography variant="h4">{stats.resolved}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {/* Customer Satisfaction */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Satisfaction
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <ThumbUpAltIcon color="success" />
              <Typography sx={{ minWidth: 70 }}>Positive</Typography>
              <LinearProgress
                variant="determinate"
                value={stats.satisfaction.positive}
                sx={{ flex: 1, mx: 2, height: 10, borderRadius: 5, bgcolor: "#e0f2f1" }}
                color="success"
              />
              <Typography sx={{ minWidth: 40 }}>{stats.satisfaction.positive}%</Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
              <ThumbDownAltIcon color="warning" />
              <Typography sx={{ minWidth: 70 }}>Neutral</Typography>
              <LinearProgress
                variant="determinate"
                value={stats.satisfaction.neutral}
                sx={{ flex: 1, mx: 2, height: 10, borderRadius: 5, bgcolor: "#fffde7" }}
                color="warning"
              />
              <Typography sx={{ minWidth: 40 }}>{stats.satisfaction.neutral}%</Typography>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <ThumbDownAltIcon color="error" />
              <Typography sx={{ minWidth: 70 }}>Negative</Typography>
              <LinearProgress
                variant="determinate"
                value={stats.satisfaction.negative}
                sx={{ flex: 1, mx: 2, height: 10, borderRadius: 5, bgcolor: "#ffebee" }}
                color="error"
              />
              <Typography sx={{ minWidth: 40 }}>{stats.satisfaction.negative}%</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* Agent Performance */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Agent Performance
            </Typography>
            <Typography>
              <b>Number of Tickets Resolved:</b> {stats.resolved}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography>
              <b>Average Resolution Time:</b> {stats.avgResolutionTime}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};