import React from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AppBar from "./AppBar"; // your styled AppBar

interface AppBarComponentProps {
  open: boolean;
}

const AppBarComponent: React.FC<AppBarComponentProps> = ({ open }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ITicket Help Desk
        </Typography>
        {user.name && (
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1">Hello, {user.name}</Typography>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;