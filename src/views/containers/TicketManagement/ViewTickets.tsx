import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  IconButton,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Chip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import EditIcon from "@mui/icons-material/Edit";
import FeedbackIcon from "@mui/icons-material/Feedback";
import DeleteIcon from "@mui/icons-material/Delete";
import TablePagination from "@mui/material/TablePagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewTickets.css";

import { TicketSummaryCards } from "../../components/TicketComponents/TicketSummaryCards";
import { TicketFilters } from "../../components/TicketComponents/TicketFilters";
import { DeleteTicketDialog } from "../../components/TicketComponents/DeleteTicketDialog";
import { TicketSnackbar } from "../../components/TicketComponents/TicketSnackbar";

const getAssignedUserName = (userId: string, users: any[]) => {
  const user = users.find((u) => u.id === userId);
  return user ? user.name : "Unassigned";
};

export const ViewTickets = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<any | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    category: "",
    assignedTo: "",
    dueDateSort: ""
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [showFilters, setShowFilters] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "admin" || user.role === "superadmin";
  const isAgent = user.role === "agent";
  const isUser = user.role === "user";

  useEffect(() => {
    axios.get("http://localhost:3000/tickets").then((res) => setTickets(res.data));
    axios.get("http://localhost:3000/users").then((res) => setUsers(res.data));
  }, []);

  const visibleTickets = isUser
    ? tickets.filter((ticket) => String(ticket.createdBy) === String(user.id))
    : tickets;

  let filteredTickets = visibleTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return (
      matchesSearch &&
      (filters.priority ? ticket.priority === filters.priority : true) &&
      (filters.status ? ticket.status === filters.status : true) &&
      (filters.category ? ticket.category === filters.category : true) &&
      (filters.assignedTo ? ticket.assignedTo === filters.assignedTo : true)
    );
  });

  if (filters.dueDateSort === "earliest") {
    filteredTickets = [...filteredTickets].sort(
      (a, b) => new Date(a.dueDate || 0).getTime() - new Date(b.dueDate || 0).getTime()
    );
  } else if (filters.dueDateSort === "latest") {
    filteredTickets = [...filteredTickets].sort(
      (a, b) => new Date(b.dueDate || 0).getTime() - new Date(a.dueDate || 0).getTime()
    );
  } else {
    const priorityOrder: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    filteredTickets = [...filteredTickets].sort((a, b) => {
      if (a.status === "Open" && b.status !== "Open") return -1;
      if (b.status === "Open" && a.status !== "Open") return 1;
      if (a.status === "Open" && b.status === "Open") {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });
  }

  const paginatedTickets = filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalTickets = visibleTickets.length;
  const openTickets = visibleTickets.filter((t) => t.status === "Open").length;
  const closedTickets = visibleTickets.filter((t) => t.status === "Closed").length;
  const highPriority = visibleTickets.filter((t) => t.priority === "High").length;

  const handleConfirmDelete = async () => {
    setDeleteDialogOpen(false);
    if (ticketToDelete) {
      try {
        await axios.delete(`http://localhost:3000/tickets/${ticketToDelete.id}`);
        setTickets((prev) => prev.filter((t) => t.id !== ticketToDelete.id));
        setSnackbar({ open: true, message: "Ticket deleted successfully!", severity: "success" });
      } catch {
        setSnackbar({ open: true, message: "Failed to delete ticket.", severity: "error" });
      }
      setTicketToDelete(null);
    }
  };

  return (
    <Box className="view-tickets-container">
      <div className="view-tickets-header">
        <h1>Ticket Dashboard</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/create-ticket")}
        >
          New Ticket
        </Button>
      </div>

      <TicketSummaryCards
        total={totalTickets}
        open={openTickets}
        closed={closedTickets}
        highPriority={highPriority}
      />

      <div className="ticket-filters-toolbar">
        <Box sx={{ flex: 1 }}>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="ticket-search-input"
          />
        </Box>

        <TicketFilters
          tempFilters={tempFilters}
          users={users}
          showFilters={showFilters}
          onToggle={() => setShowFilters((prev) => !prev)}
          onChange={(updated) => setTempFilters(updated)}
          onApply={() => {
            setFilters(tempFilters);
            setShowFilters(false);
          }}
          onReset={() => {
            const reset = { priority: "", status: "", category: "", assignedTo: "", dueDateSort: "" };
            setFilters(reset);
            setTempFilters(reset);
          }}
          onCancel={() => {
            const reset = { priority: "", status: "", category: "", assignedTo: "", dueDateSort: "" };
            setFilters(reset);
            setTempFilters(reset);
            setShowFilters(false);
          }}
        />
      </div>

      <Paper className="ticket-table-wrapper">
        <Table className="MuiTable-root MuiTable-stickyHeader">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#888" }}>
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTickets.map((ticket) => {
                const isTicketOwner = String(ticket.createdBy) === String(user.id);
                return (
                  <TableRow
                    key={ticket.id}
                    hover
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate(`/ticket/${ticket.id}`)}
                  >
                    <TableCell>{ticket.title}</TableCell>
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
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>
                      {ticket.dueDate
                        ? new Date(ticket.dueDate).toLocaleDateString("en-GB")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {ticket.assignedTo
                        ? getAssignedUserName(ticket.assignedTo, users)
                        : "Unassigned"}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      {(isAdmin || isAgent) && (
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/assign-ticket/${ticket.id}`)}
                          title="Assign"
                        >
                          <AssignmentIndIcon />
                        </IconButton>
                      )}
                      {(isAdmin || isAgent || (isUser && isTicketOwner && ticket.status !== "Resolved" && ticket.status !== "Closed")) && (
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/edit-ticket/${ticket.id}`)}
                          title="Edit"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {(ticket.status === "Resolved" || ticket.status === "Closed") &&
                        isUser &&
                        isTicketOwner && (
                          <IconButton
                            color="success"
                            onClick={() => navigate(`/collect-feedback/${ticket.id}`)}
                            title="Feedback"
                          >
                            <FeedbackIcon />
                          </IconButton>
                        )}
                      {(isAdmin || isAgent) && (
                        <IconButton
                          color="error"
                          onClick={() => {
                            setTicketToDelete(ticket);
                            setDeleteDialogOpen(true);
                          }}
                          title="Delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}>
          <TablePagination
            component="div"
            count={filteredTickets.length}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
          />
        </Box>
      </Paper>

      <DeleteTicketDialog
        open={deleteDialogOpen}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <TicketSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity as "success" | "error"}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};
