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
  { path: "/dashboard", label: "Dashboard" },
  { path: "/view-users", label: "Users", role: "admin" },
  { path: "/view-tickets", label: "Tickets" },
  { path: "/reports", label: "Reports" },
  { path: "/view-articles", label: "Knowledge Base" },
  { path: "/view-feedback", label: "Feedback", role: "admin" },  // Add this role restriction
  { path: "/set-preferences", label: "Settings" },
  { path: "/logout", label: "Logout" }
];
