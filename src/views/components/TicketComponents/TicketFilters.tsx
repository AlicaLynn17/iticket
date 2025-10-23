import React from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Select,
  MenuItem
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import FilterListIcon from "@mui/icons-material/FilterList";

interface TicketFiltersProps {
  tempFilters: Filters;
  users: { id: string; name: string; role: string }[];
  showFilters: boolean;
  onToggle: () => void;
  onChange: (newFilters: Filters) => void;
  onApply: () => void;
  onReset: () => void;
  onCancel: () => void;
}

interface Filters {
  priority: string;
  status: string;
  category: string;
  assignedTo: string;
  dueDateSort: string;
}

export const TicketFilters: React.FC<TicketFiltersProps> = ({
  tempFilters,
  users,
  showFilters,
  onToggle,
  onChange,
  onApply,
  onReset,
  onCancel,
}) => {
  const assignableUsers = users.filter(
    (u) => u.role === "admin" || u.role === "agent"
  );

  return (
    <Box display="flex" justifyContent="flex-end" mb={2} position="relative">
      <IconButton onClick={onToggle}>
        <FilterListIcon />
      </IconButton>

      {showFilters && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            top: 40,
            right: 0,
            zIndex: 10,
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 1,
            backgroundColor: "#fff",
            minWidth: 220,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2">Filters</Typography>
            <IconButton
              size="small"
              color="error"
              onClick={onReset}
              disabled={!Object.values(tempFilters).some((val) => val !== "")}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Box>

          <Select
            fullWidth
            value={tempFilters.priority}
            onChange={(e) => onChange({ ...tempFilters, priority: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Priorities</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </Select>

          <Select
            fullWidth
            value={tempFilters.status}
            onChange={(e) => onChange({ ...tempFilters, status: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="In Progress">In Progress</MenuItem>
            <MenuItem value="Closed">Closed</MenuItem>
          </Select>

          <Select
            fullWidth
            value={tempFilters.category}
            onChange={(e) => onChange({ ...tempFilters, category: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="Hardware">Hardware</MenuItem>
            <MenuItem value="Software">Software</MenuItem>
            <MenuItem value="Network">Network</MenuItem>
            <MenuItem value="Access/Account">Access/Account</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>

          <Select
            fullWidth
            value={tempFilters.assignedTo}
            onChange={(e) => onChange({ ...tempFilters, assignedTo: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">All Assignees</MenuItem>
            {assignableUsers.map((u) => (
              <MenuItem key={u.id} value={u.id}>
                {u.name} ({u.role})
              </MenuItem>
            ))}
          </Select>

          <Select
            fullWidth
            value={tempFilters.dueDateSort}
            onChange={(e) => onChange({ ...tempFilters, dueDateSort: e.target.value })}
            displayEmpty
          >
            <MenuItem value="">Due Date</MenuItem>
            <MenuItem value="earliest">Earliest Due Date</MenuItem>
            <MenuItem value="latest">Latest Due Date</MenuItem>
          </Select>

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Button size="small" variant="contained" color="primary" onClick={onApply}>
              Apply
            </Button>
            <Button size="small" variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};