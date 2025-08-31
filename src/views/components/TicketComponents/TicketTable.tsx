import React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Typography, Button, Chip, Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from "@mui/icons-material/Feedback";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

interface User {
  id: string;
  name: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignedTo?: string;
}

interface TicketTableProps {
  tickets: Ticket[];
  users: User[];
  onEdit: (id: string) => void;
  onFeedback: (id: string) => void;
  onDelete: (ticket: Ticket) => void;
}

const getAssignedUserName = (userId: string | undefined, users: User[]) => {
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "Unassigned";
};

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  users,
  onEdit,
  onFeedback,
  onDelete,
}) => {

const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const [menuTicket, setMenuTicket] = React.useState<Ticket | null>(null);

const open = Boolean(anchorEl);

const handleMenuClick = (event: React.MouseEvent<HTMLElement>, ticket: Ticket) => {
  setAnchorEl(event.currentTarget);
  setMenuTicket(ticket);
};

const handleMenuClose = () => {
  setAnchorEl(null);
  setMenuTicket(null);
};

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography color="textSecondary" sx={{ py: 2 }}>
                  No tickets found matching the filters.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.category}</TableCell>
                <TableCell>
                  <Chip
                    label={ticket.priority}
                    color={
                      ticket.priority === "High"
                        ? "error"
                        : ticket.priority === "Medium"
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={ticket.status}
                    color={ticket.status === "Closed" ? "success" : "primary"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : "—"}
                </TableCell>
                <TableCell>{getAssignedUserName(ticket.assignedTo, users)}</TableCell>
                <TableCell align="center">
                <IconButton size="small" onClick={(e) => handleMenuClick(e, ticket)}>
                    <MoreVertIcon />
                </IconButton>
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem onClick={() => { onEdit(menuTicket!.id); handleMenuClose(); }}>
          Edit
        </MenuItem>
        {(menuTicket?.status === "Closed" || menuTicket?.status === "Resolved") && (
          <MenuItem onClick={() => { onFeedback(menuTicket!.id); handleMenuClose(); }}>
            Feedback
          </MenuItem>
        )}
        <MenuItem onClick={() => { onDelete(menuTicket!); handleMenuClose(); }} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>

    </>

    
  );
};
