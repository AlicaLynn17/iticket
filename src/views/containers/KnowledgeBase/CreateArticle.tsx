import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreateArticle.css";

export const CreateArticle = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: user.name || "",
    category: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("https://localhost:5001/api/KnowledgeBase/CreateArticle", {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      setSnackbar({
        open: true,
        message: "Article created successfully!",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/view-articles");
      }, 1200);
    } catch (error) {
      console.error("Error creating article:", error);
      setSnackbar({
        open: true,
        message: "Failed to create article.",
        severity: "error",
      });
    }
  };

  return (
    <Box className="create-article-container">
      <div className="create-article-box">
        <h1>Create Article</h1>
        <h2>Contribute to the Knowledge Base</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <TextField
              fullWidth
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <TextField
              fullWidth
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              multiline
              rows={6}
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Author</label>
            <TextField
              fullWidth
              name="author"
              value={formData.author}
              disabled
              size="small"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <TextField
              select
              fullWidth
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              size="small"
              SelectProps={{ native: true }}
            >
              <option value="">Select Category</option>
              <option value="FAQs">FAQs</option>
              <option value="How-Tos">How-Tos</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Other">Other</option>
            </TextField>
          </div>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/view-articles")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Create Article
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
