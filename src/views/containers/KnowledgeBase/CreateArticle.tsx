import React, { useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, Stack } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CreateArticle = () => {
  const navigate = useNavigate();
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: user.name || "", // Use the logged-in user's name
  });

   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/knowledgeBase", {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSnackbar({ open: true, message: "Article created successfully!", severity: "success" });
      setFormData({ title: "", content: "", author: user.name || "" });
      setTimeout(() => {
        navigate("/view-articles");
      }, 900);
    } catch (error) {
      console.error("Error creating article:", error);
      setSnackbar({ open: true, message: "Failed to create article.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Create Article
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={6}
          required
        />
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => navigate("/view-articles")}
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Article
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