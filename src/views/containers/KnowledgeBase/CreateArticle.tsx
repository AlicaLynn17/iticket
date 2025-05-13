import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateArticle.css";

export const CreateArticle = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: user.name || "",
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
      setTimeout(() => navigate("/view-articles"), 1000);
    } catch (error) {
      console.error("Error creating article:", error);
      setSnackbar({ open: true, message: "Failed to create article.", severity: "error" });
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
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" fullWidth onClick={() => navigate("/view-articles")}>
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
