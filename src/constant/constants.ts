// ROUTER PATH
export const PATHS = {
  MAIN: {
    path: "/",
    label: "Home"
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
  },
  VIEW_USERS: {
    path: "/view-users",
    label: "Users"
  },
  ADD_USER: {
    path: "/add-user",
    label: "Add User"
  },
  EDIT_USER: {
    path: "/edit-user/:id",
    label: "Edit User"
  },
  VIEW_TICKETS: {
    path: "/view-tickets",
    label: "Tickets"
  },
  CREATE_TICKET: {
    path: "/create-ticket",
    label: "Create Ticket"
  },
  EDIT_TICKET: {
    path: "/edit-ticket/:id",
    label: "Edit Ticket"
  },
  ASSIGN_TICKET: {
    path: "/assign-ticket/:id",
    label: "Assign Ticket"
  },
  REPORTS: {
    path: "/reports",
    label: "Reports"
  },
  VIEW_ARTICLES: {
    path: "/view-articles",
    label: "Knowledge Base"
  },
  CREATE_ARTICLE: {
    path: "/create-article",
    label: "Create Article"
  },
  EDIT_ARTICLE: {
    path: "/edit-article/:id",
    label: "Edit Article"
  },
  ARTICLE_DETAILS: {
    path: "/article-details/:id",
    label: "Article Details"
  },
  VIEW_FEEDBACK: {
    path: "/view-feedback",
    label: "Feedback"
  },
  COLLECT_FEEDBACK: {
    path: "/collect-feedback/:ticketId",
    label: "Collect Feedback"
  },
  SET_PREFERENCES: {
    path: "/set-preferences",
    label: "Settings"
  }
};

// SIDE BAR MENU PATH
export const SIDE_BAR_MENU = [
  { path: "/dashboard", label: "Dashboard", roles: ["admin", "superadmin", "agent" ] },
  { path: "/view-users", label: "Users", roles: ["admin", "superadmin"] },
  { path: "/view-tickets", label: "Tickets", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/reports", label: "Reports", roles: ["admin", "superadmin" ] },
  { path: "/view-articles", label: "Knowledge Base", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/view-feedback", label: "Feedback", roles: ["admin", "superadmin"] },
  { path: "/set-preferences", label: "Settings", roles: ["admin", "superadmin", "agent", "user"] },
  { path: "/logout", label: "Logout", roles: ["admin", "superadmin", "agent", "user"] }
];
