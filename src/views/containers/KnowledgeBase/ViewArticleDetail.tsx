import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewArticleDetail.css";

export const ViewArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/knowledgeBase/${id}`).then((res) => {
      setArticle(res.data);
    });
  }, [id]);

  if (!article) return null;

  return (
    <Box className="view-article-container">
      <div className="view-article-box">
        <h1>{article.title}</h1>
        <p className="article-meta">
          By {article.author} •{" "}
          {article.createdAt ? new Date(article.createdAt).toLocaleString() : "Unknown date"}
        </p>
        <Typography variant="body1" sx={{ whiteSpace: "pre-line", color: "#333" }}>
          {article.content}
        </Typography>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate("/view-articles")}>
          Back to Articles
        </Button>
      </div>
    </Box>
  );
};
