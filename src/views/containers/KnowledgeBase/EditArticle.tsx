import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./EditArticle.css";

export const EditArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    createdAt: ""
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:3000/knowledgeBase/${id}`)
        .then((res) => setFormData(res.data))
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to load article.",
            severity: "error"
          });
        });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/knowledgeBase/${id}`, {
        ...formData,
        updatedAt: new Date().toISOString()
      });

      setSnackbar({
        open: true,
        message: "Article updated successfully!",
        severity: "success"
      });

      setTimeout(() => navigate("/view-articles"), 1000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to update article.",
        severity: "error"
      });
    }
  };

  return (
    <Box className="edit-article-container">
      <div className="edit-article-box">
        <h1>Edit Article</h1>
        <h2>Make changes and save your knowledge base entry</h2>
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
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/view-articles")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Update Article
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
