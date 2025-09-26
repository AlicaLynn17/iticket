import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";
import { PrivateRoute } from "./views/components/PrivateRoute";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.SIGNUP.path} element={<Views.SignUp />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />

        {/* PRIVATE ROUTES (require login) */}
        <Route
          path={PATHS.MAIN.path}
          element={
            <PrivateRoute>
              <Views.Main />
            </PrivateRoute>
          }
        >
          <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} />
          <Route path="/view-tickets" element={<Views.ViewTickets />} />
          <Route path="/create-ticket" element={<Views.CreateTicket />} />
          <Route path="/edit-ticket/:id" element={<Views.EditTicket />} />
          <Route path="/assign-ticket/:id" element={<Views.AssignTicket />} />

          <Route path="/reports" element={<Views.ReportsDashboard />} />
          <Route path="/ticket-summary" element={<Views.TicketSummary />} />
          <Route path="/agent-performance" element={<Views.AgentPerformanceReport />} />

          <Route path="/set-preferences" element={<Views.SetPreferences />} />

          <Route path="/create-article" element={<Views.CreateArticle />} />
          <Route path="/view-articles" element={<Views.ViewArticles />} />
          <Route path="/view-article/:id" element={<Views.ViewArticleDetail />} />
          <Route path="/edit-article/:id" element={<Views.EditArticle />} />

          <Route path="/collect-feedback/:ticketId" element={<Views.CollectFeedback />} />
          <Route path="/view-feedback" element={<Views.ViewFeedback />} />

          <Route path="/ticket/:id" element={<Views.TicketsSummary />} />

          <Route path="/add-user" element={<Views.AddUser />} />
          <Route path="/view-users" element={<Views.ViewUsers />} />
          <Route path="/edit-user/:id" element={<Views.EditUser />} />
        </Route>

        <Route path="*" element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
