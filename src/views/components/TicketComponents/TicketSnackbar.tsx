import React from "react";
import { Snackbar, Alert } from "@mui/material";

interface TicketSnackbarProps {
  open: boolean;
  message: string;
  severity: "success" | "error";
  onClose: () => void;
}

export const TicketSnackbar: React.FC<TicketSnackbarProps> = ({
  open,
  message,
  severity,
  onClose
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={1500}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
