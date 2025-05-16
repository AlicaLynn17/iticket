import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import "./ViewArticles.css";

const articles = [
  {
    id: "1",
    category: "FAQs",
    title: "What is ITicket?",
    description: "An overview of the ITicket platform, its purpose, and key features.",
    author: "Admin",
    createdAt: "2024-10-12T10:00:00Z",
  },
  {
    id: "2",
    category: "How-Tos",
    title: "How to submit a ticket",
    description: "Step-by-step instructions on how to file a support ticket in ITicket.",
    author: "Support",
    createdAt: "2024-09-21T15:30:00Z",
  },
  {
    id: "3",
    category: "Troubleshooting",
    title: "Cannot log into ITicket",
    description: "Solutions for common login issues faced by users.",
    author: "Agent1",
    createdAt: "2024-08-05T08:15:00Z",
  },
];


export const ViewArticles = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin";

  const categories = ["FAQs", "How-Tos", "Troubleshooting"];

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setSelectedArticleId(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting article:", selectedArticleId);
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
                      {article.description}
                    </Typography>
                    <Typography variant="caption" className="article-meta">
                      By {article.author} • {new Date(article.createdAt).toLocaleDateString()}
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
    </Box>
  );
};
