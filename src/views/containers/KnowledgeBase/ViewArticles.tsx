import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  Snackbar,
  Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const ViewArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/knowledgeBase").then(res => setArticles(res.data));
  }, []);

  const handleDeleteClick = (article: any) => {
    setArticleToDelete(article);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (articleToDelete) {
      try {
        await axios.delete(`http://localhost:3000/knowledgeBase/${articleToDelete.id}`);
        setArticles(articles.filter(article => article.id !== articleToDelete.id));
        setSnackbar({ open: true, message: "Article deleted successfully!", severity: "success" });
      } catch {
        setSnackbar({ open: true, message: "Failed to delete article.", severity: "error" });
      }
      setDeleteDialogOpen(false);
      setArticleToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setArticleToDelete(null);
  };

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Articles</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-article")}
        >
          New Article
        </Button>
      </Stack>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {articles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              articles.map(article => (
                <TableRow key={article.id} hover>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{article.author}</TableCell>
                  <TableCell>
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString()
                      : "-"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/edit-article/${article.id}`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(article)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this article?
          <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 1, justifyContent: "flex-end" }}>
            <Button onClick={handleCancelDelete} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
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