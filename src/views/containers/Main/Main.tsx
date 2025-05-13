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
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LogoutIcon from "@mui/icons-material/Logout";

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

  // OPEN DRAWER LEFT SIDE
  const [openDrawer, setOpenDrawer] = React.useState(true);

  const drawerWidth = openDrawer ? drawerWidthOpen : drawerWidthClosed;

  // THEME CUSTOMIZATION
  const theme = useTheme();

  useEffect(() => {
    // AUTO DIRECT USER TO DASHBOARD WHEN PATH IS DEFAULT
    if (location.pathname === PATHS.MAIN.path) navigate(PATHS.LOGIN.path);
  }, [location.pathname, navigate]);


  return (
    <Fragment>
      <CssBaseline />
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawer(!openDrawer)}
            edge="start"
            sx={[
              { mr: 2 },
              openDrawer && { display: "none" }
            ]}
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
            transition: "width 0.3s",
          }
        }}
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        {/* Close button at the top */}
          <IconButton onClick={() => setOpenDrawer(!openDrawer)} sx={{ color: "#fff", mt: 1, mb: 1 }}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        
        <Divider sx={{ borderColor: "#3e5c6d" }} />
        {/* SIDE BAR MENU ITEMS */}
        <List>
          {SIDE_BAR_MENU.map((item) => (
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
      <MainLayout open={openDrawer}>
        <DrawerHeader />
        <Outlet />
      </MainLayout>
    </Fragment>
  );
};

export const drawerWidthOpen = 140;
export const drawerWidthClosed = 56;

const MainLayout = styled("main", {
  shouldForwardProp: (prop) => prop !== "open"
})<{ open?: boolean }>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: open ? drawerWidthOpen : drawerWidthClosed,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
}));

export default MainLayout;