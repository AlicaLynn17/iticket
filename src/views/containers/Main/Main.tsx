import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router";
import { PATHS, SIDE_BAR_MENU } from "../../../constant";
import DrawerHeader from "../../components/DrawerHeader";
import CssBaseline from "@mui/material/CssBaseline";
import React, { Fragment, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import AppBar from "../../components/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// Material UI icons
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Box } from "@mui/material";

// Icon map
const iconMap: Record<string, React.ReactNode> = {
  Dashboard: <DashboardIcon />,
  Users: <PeopleIcon />,
  Tickets: <AssignmentIcon />,
  Reports: <BarChartIcon />,
  Preferences: <SettingsIcon />,
  "Knowledge Base": <MenuBookIcon />,
  Feedback: <FeedbackIcon />,
  Settings: <SettingsIcon />,
  Logout: <LogoutIcon />,
};

export const drawerWidthOpen = 160;

export const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const openDrawer = true;

  useEffect(() => {
    if (location.pathname === PATHS.MAIN.path) navigate(PATHS.LOGIN.path);
  }, [location.pathname, navigate]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const filteredMenu = SIDE_BAR_MENU.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ color: "#29404a" }}>
            ITicket Help Desk
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidthOpen,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidthOpen,
            boxSizing: "border-box",
            bgcolor: "#29404a",
            color: "#fff",
            borderRight: 0,
            overflowY: "auto",
            transition: "width 0.3s",
          },
        }}
        variant="persistent"
        anchor="left"
        open={true}
      >
        <Divider sx={{ borderColor: "#3e5c6d" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 1,
          }}
        >
          <Avatar
            src={user.profilePic || ""}
            sx={{ width: 50, height: 50, bgcolor: "#3C5759", fontSize: 28, mb: 1 }}
          >
            {!user.profilePic && user.name ? user.name[0] : ""}
          </Avatar>
          <Typography variant="subtitle1" sx={{ color: "#fff", fontSize: 15 }}>
            {user.name || "User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#b0bec5" }}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "#3e5c6d" }} />

        <List>
          {filteredMenu.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ display: "block", mb: 2 }}>
              <NavLink
                to={item.path}
                style={({ isActive }) => ({
                  textDecoration: "none",
                  color: "#fff",
                  background: isActive ? "#3e5c6d" : "inherit",
                  borderRadius: 8,
                  margin: "8px 4px",
                  display: "block",
                })}
              >
                <ListItemButton
                  sx={{
                    justifyContent: "flex-start",
                    px: 1.5,
                    py: 1,
                    minHeight: 48,
                    gap: 1,
                  }}
                  selected={location.pathname.startsWith(item.path)}
                >
                  <ListItemIcon sx={{ color: "#fff", minWidth: 0, mr: 1.5 }}>
                    {iconMap[item.label] || <DashboardIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <MainLayout open={openDrawer}>
        <DrawerHeader />
        <Outlet />
      </MainLayout>
    </Fragment>
  );
};

const MainLayout = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidthOpen,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default MainLayout;
