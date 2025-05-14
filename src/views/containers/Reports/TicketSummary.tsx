import React, { useEffect, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const summaryOptions = [
  { value: "category", label: "Category" },
  { value: "status", label: "Status" },
  { value: "priority", label: "Priority" }
];

export const TicketSummary = () => {
  const [tickets, setTickets] = useState([]);
  const [summaryBy, setSummaryBy] = useState("category");
  const [summary, setSummary] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    axios.get("http://localhost:3000/tickets").then(res => setTickets(res.data));
  }, []);

  useEffect(() => {
    const counts: { [key: string]: number } = {};
    tickets.forEach(ticket => {
      const key = ticket[summaryBy] || "Unknown";
      counts[key] = (counts[key] || 0) + 1;
    });
    setSummary(counts);
  }, [tickets, summaryBy]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    setSummaryBy(e.target.value);
  };

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: 180, mb: 2 }}>
        <InputLabel>Summary By</InputLabel>
        <Select value={summaryBy} label="Summary By" onChange={handleChange}>
          {summaryOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Paper variant="outlined" sx={{ mt: 1 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>{summaryOptions.find(opt => opt.value === summaryBy)?.label}</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(summary).map(([key, count]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};