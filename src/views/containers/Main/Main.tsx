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
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
// import MainLayoutComponent from "../../components/Main";
import AppBar from "../../components/AppBar";
import Divider from "@mui/material/Divider";
import Toolbar from "@mui/material/Toolbar";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";


// Material UI icons for each menu item
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
// import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Avatar } from "@mui/material";

// Map menu labels to icons
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

export const Main = () => {
  // NAVIGATE TO SPECIFIC USER
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const drawerWidth = openDrawer ? drawerWidthOpen : drawerWidthClosed;

  const theme = useTheme();

  useEffect(() => {
    if (location.pathname === PATHS.MAIN.path) navigate(PATHS.LOGIN.path);
  }, [location.pathname, navigate]);
  
  useEffect(() => {
    setOpenDrawer(false);
  }, [location.pathname]);

  function handleDrawerClose() {
    setOpenDrawer(false);
  }

  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setOpenDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            ITicket Help Desk
          </Typography>
        </Toolbar>
      </AppBar>
      {/* SIDE BAR DRAWER */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#29404a",
            color: "#fff",
            borderRight: 0,
            overflowX: "hidden",
            transition: "width 0.3s cubic-bezier(0.4,0,0.2,1), left 0.3s cubic-bezier(0.4,0,0.2,1)",
            "&::-webkit-scrollbar": {
              display: "none"
            },
            /* Hide scrollbar for IE, Edge and Firefox */
            scrollbarWidth: "none",
            msOverflowStyle: "none"
          }
        }}
        variant="temporary"
        anchor="left"
        open={openDrawer}
        onClose={handleDrawerClose}
      >
        {/* Close button at the top */}
          <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{ color: "#fff", mt: 1, mb: 1 }}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        
        <Divider sx={{ borderColor: "#3e5c6d" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 2,
            bgcolor: "#29404a"
          }}
        >
          <Avatar sx={{ bgcolor: "#3e5c6d", mb: 1 }}>
            {user.name ? user.name[0].toUpperCase() : <PeopleIcon />}
          </Avatar>
          <Typography variant="body2" sx={{ color: "#fff", fontWeight: 500 }}>
            {user.name || "User"}
          </Typography>
          <Typography variant="caption" sx={{ color: "#b0bec5" }}>
            {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: "#3e5c6d" }} />
        {/* SIDE BAR MENU ITEMS */}
        <List>
          {SIDE_BAR_MENU
            .filter((item) =>
              (!item.roles || item.roles.includes(user.role)) &&
              !(user.role === "user" && item.label === "Dashboard")
            )
            .map((item) => (
              <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    color: "#fff",
                    background: isActive ? "#3e5c6d" : "inherit",
                    borderRadius: 8,
                    margin: "8px 4px",
                    display: "block"
                  })}
                >
                  <ListItemButton
                    sx={{
                      flexDirection: "column",
                      alignItems: "center",
                      py: 2,
                      minHeight: 56,
                    }}
                    selected={location.pathname.startsWith(item.path)}
                  >
                    <ListItemIcon sx={{ color: "#fff", minWidth: 0, mb: 0.5 }}>
                      {iconMap[item.label] || <DashboardIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={openDrawer ? item.label : ""}
                      primaryTypographyProps={{
                        fontSize: 12,
                        textAlign: "center",
                        color: "#fff"
                      }}
                    />
                  </ListItemButton>
                </NavLink>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <MainLayout>
        <DrawerHeader />
        <Outlet />
      </MainLayout>
    </Fragment>
  );
};

export const drawerWidthOpen = 140;
export const drawerWidthClosed = 56;

const MainLayout = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

export default MainLayout;