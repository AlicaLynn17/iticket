import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";
import { PrivateRoute } from "./views/components/PrivateRoute";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* Private Routes */}
          <Route
            path={PATHS.DASHBOARD.path}
            element={<PrivateRoute><Views.Dashboard /></PrivateRoute>}
          />
          <Route
            path={PATHS.ADD_USER?.path || "/add-user"}
            element={
              <PrivateRoute allowedRoles={["admin", "superadmin"]}>
                <Views.AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.VIEW_USERS.path}
            element={
              <PrivateRoute allowedRoles={["admin", "superadmin"]}>
                <Views.ViewUsers />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.EDIT_USER.path}
            element={
              <PrivateRoute allowedRoles={["admin", "superadmin"]}>
                <Views.EditUser />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.CREATE_TICKET.path}
            element={
              <PrivateRoute allowedRoles={["user", "agent", "admin"]}>
                <Views.CreateTicket />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.VIEW_TICKETS.path}
            element={
              <PrivateRoute allowedRoles={["user", "agent", "admin"]}>
                <Views.ViewTickets />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.EDIT_TICKET.path}
            element={
              <PrivateRoute allowedRoles={["user", "agent", "admin"]}>
                <Views.EditTicket />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.ASSIGN_TICKET.path}
            element={
              <PrivateRoute allowedRoles={["agent", "admin"]}>
                <Views.AssignTicket />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.REPORTS.path}
            element={
              <PrivateRoute allowedRoles={["agent", "admin", "superadmin"]}>
                <Views.ReportsDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.SET_PREFERENCES.path}
            element={
              <PrivateRoute>
                <Views.SetPreferences />
              </PrivateRoute>
            }
          />
          {/* Knowledge Base */}
          <Route
            path={PATHS.CREATE_ARTICLE.path}
            element={
              <PrivateRoute allowedRoles={["agent", "admin", "superadmin"]}>
                <Views.CreateArticle />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.VIEW_ARTICLES.path}
            element={
              <PrivateRoute>
                <Views.ViewArticles />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.ARTICLE_DETAILS.path}
            element={
              <PrivateRoute>
                <Views.ViewArticle />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.EDIT_ARTICLE.path}
            element={
              <PrivateRoute allowedRoles={["agent", "admin", "superadmin"]}>
                <Views.EditArticle />
              </PrivateRoute>
            }
          />
          {/* Feedback */}
          <Route
            path={PATHS.COLLECT_FEEDBACK.path}
            element={
              <PrivateRoute>
                <Views.CollectFeedback />
              </PrivateRoute>
            }
          />
          <Route
            path={PATHS.VIEW_FEEDBACK.path}
            element={
              <PrivateRoute>
                <Views.ViewFeedback />
              </PrivateRoute>
            }
          />
        </Route>
        {/* Public Routes */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};