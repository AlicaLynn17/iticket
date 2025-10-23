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
  const { id: articleId } = useParams<{ id: string }>();

  const [formData, setFormData] = useState({
    id: 0,
    title: "",
    content: "",
    category: ""
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  // 🔹 Fetch existing article details
  useEffect(() => {
    if (articleId) {
      axios
        .get(`https://localhost:5001/api/KnowledgeBase/GetById/${articleId}`)
        .then((res) => {
          const a = res.data;
          setFormData({
            id: a.id,
            title: a.title || "",
            content: a.content || "",
            category: a.category || ""
          });
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: "Failed to load article.",
            severity: "error"
          });
        });
    }
  }, [articleId]);

  // 🔹 Handle input and dropdown changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Update article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!articleId) {
      console.error("No article ID provided.");
      return;
    }

    try {
      await axios.put(`https://localhost:5001/api/KnowledgeBase/UpdateArticle/${articleId}`, {
        ...formData,
        id: parseInt(articleId)
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

          {/* ✅ Category dropdown now matches CreateArticle */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="FAQs">FAQs</option>
              <option value="How-Tos">How-Tos</option>
              <option value="Troubleshooting">Troubleshooting</option>
              <option value="Other">Other</option>
            </select>
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
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity as "success" | "error"}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
