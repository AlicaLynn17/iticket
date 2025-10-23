import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewArticles.css";

export const ViewArticles = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";

  const [articles, setArticles] = useState<any[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const categories = ["FAQs", "How-Tos", "Troubleshooting", "Other"];

  useEffect(() => {
    axios.get("https://localhost:5001/api/KnowledgeBase/GetArticles").then((res) => {
      setArticles(res.data);
    });
  }, []);

  const handleDelete = (id: string) => {
    setSelectedArticleId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedArticleId) {
      try {
        await axios.delete(`https://localhost:5001/api/KnowledgeBase/DeleteArticle/${selectedArticleId}`);
        setArticles((prev) => prev.filter((a) => a.id !== selectedArticleId));

        setSnackbar({
          open: true,
          message: "Article deleted successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Failed to delete article", error);

        setSnackbar({
          open: true,
          message: "Failed to delete article.",
          severity: "error",
        });
      }
    }

    setDeleteModalOpen(false);
    setSelectedArticleId(null);
  };

  return (
    <Box className="view-articles-container">
      <div className="view-articles-header">
        <h1>Knowledge Base</h1>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/create-article")}
          >
            New Article
          </Button>
        )}
      </div>

      {categories.map((cat) => (
        <div key={cat} className="article-category-section">
          <Typography variant="h6" className="category-title">
            {cat}
          </Typography>
          <Stack spacing={2}>
            {articles
              .filter((a) => a.category === cat)
              .map((article) => (
                <Paper key={article.id} className="article-card">
                  <div
                    className="article-info"
                    onClick={() => {
                      localStorage.setItem("selectedArticle", JSON.stringify(article));
                      navigate(`/view-article/${article.id}`);
                    }}
                  >
                    <Typography variant="subtitle1" className="article-title">
                      {article.title}
                    </Typography>
                    <Typography variant="body2" className="article-description">
                      {article.content.slice(0, 100)}...
                    </Typography>
                    <Typography variant="caption" className="article-meta">
                      By {article.author} •{" "}
                      {new Date(article.createdAt).toLocaleDateString("en-GB")}
                    </Typography>
                  </div>

                  {isAdmin && (
                    <div className="article-actions">
                      <Button
                        size="small"
                        onClick={() => navigate(`/edit-article/${article.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(article.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Paper>
              ))}
          </Stack>
        </div>
      ))}

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this article?
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteModalOpen(false)}
            variant="outlined"
            sx={{ px: 3, py: 1, fontSize: "0.875rem" }}
          >
            No
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{ px: 2, py: 1, fontSize: "0.875rem" }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

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
