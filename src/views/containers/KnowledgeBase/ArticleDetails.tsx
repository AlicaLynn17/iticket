import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Divider, CircularProgress, Stack, Avatar } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

export const ViewArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/knowledgeBase/${id}`)
      .then(res => setArticle(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!article) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h6" color="error">Article not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, margin: "40px auto" }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <ArrowBackIcon
            sx={{ cursor: "pointer", color: "#29404a" }}
            onClick={() => navigate("/view-articles")}
          />
          <Typography variant="h4" fontWeight={700}>
            {article.title}
          </Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
          <Avatar sx={{ bgcolor: "#3e5c6d" }}>
            {article.author ? article.author[0].toUpperCase() : "?"}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {article.author || "Unknown Author"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {article.createdAt ? new Date(article.createdAt).toLocaleString() : ""}
            </Typography>
          </Box>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-line",
            fontSize: 17,
            color: "#222",
            lineHeight: 1.7,
            mb: 1
          }}
        >
          {article.content}
        </Typography>
      </Paper>
    </Box>
  );
};