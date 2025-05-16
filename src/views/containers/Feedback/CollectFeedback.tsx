import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./CollectFeedback.css";

export const CollectFeedback = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rating: 0,
    comments: "",
    userId: "13ec", 
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

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
      setTimeout(() => navigate("/view-tickets"), 1000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setSnackbar({ open: true, message: "Failed to submit feedback.", severity: "error" });
    }
  };

  return (
    <Box className="collect-feedback-container">
      <div className="collect-feedback-box">
        <h1 className="feedback-header">Give Feedback</h1>
        <Typography variant="subtitle1" className="feedback-subtext">
          How was your support experience?
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Rating</label>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              size="large"
            />
          </div>
          <div className="form-group">
            <label>Comments</label>
            <TextField
              fullWidth
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Tell us what went well or what we can improve..."
              size="small"
            />
          </div>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/view-tickets")}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Submit Feedback
            </Button>
          </Stack>
        </form>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={1500}
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
