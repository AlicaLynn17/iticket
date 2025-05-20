// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Not Found"
  },
  SIGNUP: {
    path: "/signup",
    label: "Signup"
  },
  LOGIN: {
    path: "/login",
    label: "Login"
  },
  LOGOUT: {
    path: "/logout",
    label: "Logout"
  },
  DASHBOARD: {
    path: "/dashboard",
    label: "Dashboard"
  },
  NOT_FOUND: {
    path: "*",
    label: "Not Found"
  }
  // Add more routes here
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  { path: "/dashboard", label: "Dashboard", roles: ["admin", "superadmin", "agent"] },
  { path: "/view-users", label: "Users", roles: ["admin", "superadmin"] },
  { path: "/view-tickets", label: "Tickets", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/reports", label: "Reports", roles: ["admin", "superadmin"] },
  { path: "/view-articles", label: "Knowledge Base", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/view-feedback", label: "Feedback", roles: ["admin", "superadmin"] },
  { path: "/set-preferences", label: "Settings", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/logout", label: "Logout", roles: ["admin", "superadmin", "agent", "user"] }
];
