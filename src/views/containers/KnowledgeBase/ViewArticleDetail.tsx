import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewArticleDetail.css";

export const ViewArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://localhost:5001/api/KnowledgeBase/GetById/${id}`)
        .then((res) => setArticle(res.data))
        .catch((err) => {
          console.error("Failed to fetch article:", err);
        });
    }
  }, [id]);

  if (!article) return null;

  return (
    <Box className="view-article-container">
      <Paper className="view-article-box" elevation={3}>
        <Typography variant="h4" className="article-title">
          {article.title}
        </Typography>

        {article.description && (
          <Typography
            variant="subtitle1"
            className="article-description"
            sx={{ mb: 1, color: "#555" }}
          >
            {article.description}
          </Typography>
        )}

        <Typography variant="caption" className="article-meta">
          By {article.author || "Unknown"} •{" "}
          {article.createdAt
            ? new Date(article.createdAt).toLocaleDateString("en-GB")
            : "Unknown date"}
        </Typography>

        <Typography
          variant="body1"
          className="article-content"
          sx={{ whiteSpace: "pre-line", mt: 2 }}
        >
          {article.content}
        </Typography>

        <Button
          variant="contained"
          className="back-button"
          onClick={() => navigate("/view-articles")}
          sx={{ mt: 3 }}
        >
          Back to Articles
        </Button>
      </Paper>
    </Box>
  );
};
