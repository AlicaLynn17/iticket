import React, { useEffect, useState } from "react";
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import axios from "axios";

export const TicketSummary = () => {
  const [summary, setSummary] = useState({
    byCategory: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byPriority: {} as Record<string, number>,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get("http://localhost:3000/tickets");
        const tickets = response.data;

        // Summarize tickets
        const byCategory: Record<string, number> = {};
        const byStatus: Record<string, number> = {};
        const byPriority: Record<string, number> = {};

        tickets.forEach((ticket: any) => {
          byCategory[ticket.category] = (byCategory[ticket.category] || 0) + 1;
          byStatus[ticket.status] = (byStatus[ticket.status] || 0) + 1;
          byPriority[ticket.priority] = (byPriority[ticket.priority] || 0) + 1;
        });

        setSummary({ byCategory, byStatus, byPriority });
      } catch (error) {
        console.error("Error fetching ticket summary:", error);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, margin: "auto", mt: 5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell>Details</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>By Category</TableCell>
            <TableCell>
              {Object.entries(summary.byCategory).map(([category, count]) => (
                <div key={category}>
                  {category}: {count}
                </div>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>By Status</TableCell>
            <TableCell>
              {Object.entries(summary.byStatus).map(([status, count]) => (
                <div key={status}>
                  {status}: {count}
                </div>
              ))}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>By Priority</TableCell>
            <TableCell>
              {Object.entries(summary.byPriority).map(([priority, count]) => (
                <div key={priority}>
                  {priority}: {count}
                </div>
              ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Box>
  );
};