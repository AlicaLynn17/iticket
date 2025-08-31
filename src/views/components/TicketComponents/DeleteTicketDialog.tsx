import React from "react";
import {
  Dialog, DialogContent, DialogTitle, Typography,
  Stack, Button
} from "@mui/material";

interface DeleteTicketDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteTicketDialog: React.FC<DeleteTicketDialogProps> = ({
  open,
  onCancel,
  onConfirm
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this ticket?</Typography>
      </DialogContent>
      <Stack direction="row" spacing={2} sx={{ p: 2, justifyContent: "flex-end" }}>
        <Button onClick={onCancel} variant="outlined">No</Button>
        <Button onClick={onConfirm} color="error" variant="contained">Yes</Button>
      </Stack>
    </Dialog>
  );
};
