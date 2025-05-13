import React, { useState } from "react";
import { Box, Button, TextField, Typography, Rating, Snackbar, Alert, Stack } from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export const CollectFeedback = () => {
  const { ticketId } = useParams(); // Get the ticket ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rating: 0,
    comments: "",
    userId: "13ec", // Replace with the logged-in user's ID
  });

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingChange = (event: React.SyntheticEvent, value: number | null) => {
    setFormData({ ...formData, rating: value || 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/feedback", {
        ...formData,
        ticketId,
        createdAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: "Feedback submitted successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-tickets");
      }, 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSnackbar({ open: true, message: "Failed to submit feedback.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Provide Feedback
      </Typography>
      <form onSubmit={handleSubmit}>
        <Typography component="legend">Rating</Typography>
        <Rating
          name="rating"
          value={formData.rating}
          onChange={handleRatingChange}
        />
        <TextField
          fullWidth
          label="Comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
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
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit Feedback
          </Button>
        </Stack>
      </form>
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