import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import axios from "axios";


export const AgentPerformanceReport = () => {
  const [performance, setPerformance] = useState([]);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const [usersResponse, ticketsResponse] = await Promise.all([
          axios.get("http://localhost:3000/users"),
          axios.get("http://localhost:3000/tickets")
        ]);

        const users = usersResponse.data.filter((user: any) => user.role === "agent");
        const tickets = ticketsResponse.data;

        const performanceData = users.map((user: any) => {
          const userTickets = tickets.filter((ticket: any) => ticket.assignedTo === user.id);
          const resolvedTickets = userTickets.filter((ticket: any) => ticket.status === "Resolved");
          const averageResolutionTime =
            resolvedTickets.reduce((total: number, ticket: any) => {
              const createdAt = new Date(ticket.createdAt).getTime();
              const resolvedAt = new Date(ticket.resolvedAt).getTime();
              return total + (resolvedAt - createdAt);
            }, 0) / resolvedTickets.length || 0;

          return {
            agent: user.name,
            ticketsResolved: resolvedTickets.length,
            averageResolutionTime:
              averageResolutionTime > 0
                ? (averageResolutionTime / (1000 * 60 * 60)).toFixed(2) + " hours"
                : "N/A"
          };
        });

        setPerformance(performanceData);
      } catch (error) {
        console.error("Error fetching agent performance:", error);
      }
    };

    fetchPerformance();
  }, []);

  return (
    <Box className="performance-report-container">
      <div className="performance-report-box">
        <Paper className="report-table-wrapper">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Agent</TableCell>
                <TableCell>Tickets Resolved</TableCell>
                <TableCell>Avg. Resolution Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {performance.map((data: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{data.agent}</TableCell>
                  <TableCell>{data.ticketsResolved}</TableCell>
                  <TableCell>{data.averageResolutionTime}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </div>
    </Box>
  );
};
