import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, Snackbar, Alert, Stack } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export const EditArticle = () => {
  const { id } = useParams(); // Get the article ID from the URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
  });

   const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/knowledgeBase/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/knowledgeBase/${id}`, formData);
      setSnackbar({ open: true, message: "Article updated successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/view-articles");
      }, 900);
    } catch (error) {
      console.error("Error updating article:", error);
      setSnackbar({ open: true, message: "Failed to update article.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 5 }}>
      <Typography variant="h5" gutterBottom>
        Edit Article
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
            Update Article
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