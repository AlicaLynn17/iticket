import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";
import { AddUser } from "./views/containers/UserManagement/AddUser";
import { PrivateRoute } from "./views/components/PrivateRoute";
import { ViewUsers } from "./views/containers/UserManagement/ViewUsers";
import { EditUser } from "./views/containers/UserManagement/EditUser";
import { CreateTicket } from "./views/containers/TicketManagement/CreateTicket";
import { ViewTickets } from "./views/containers/TicketManagement/ViewTickets";
import { EditTicket } from "./views/containers/TicketManagement/EditTicket";
import { AssignTicket } from "./views/containers/TicketManagement/AssignTicket";
import { ReportsDashboard } from "./views/containers/Reports/ReportsDashboard";
import { TicketSummary } from "./views/containers/Reports/TicketSummary";
import { AgentPerformanceReport } from "./views/containers/Reports/AgentPerformanceReport";
import { SetPreferences } from "./views/containers/Settings/SetPreferences";
import { CreateArticle } from "./views/containers/KnowledgeBase/CreateArticle";
import { ViewArticles } from "./views/containers/KnowledgeBase/ViewArticles";
import { ViewArticleDetail } from "./views/containers/KnowledgeBase/ViewArticleDetail";
import { EditArticle } from "./views/containers/KnowledgeBase/EditArticle";
import { CollectFeedback } from "./views/containers/Feedback/CollectFeedback";
import { ViewFeedback } from "./views/containers/Feedback/ViewFeedback";


export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* ADD PPRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
          <Route path={PATHS.DASHBOARD.path} element={<PrivateRoute><Views.Dashboard /></PrivateRoute>} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/view-users" element={<ViewUsers />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/create-ticket" element={<CreateTicket />} />
          <Route path="/view-tickets" element={<ViewTickets />} />
          <Route path="/edit-ticket/:id" element={<EditTicket />} />
          <Route path="/assign-ticket/:id" element={<AssignTicket />} />
          <Route path="/reports" element={<ReportsDashboard />} />
          <Route path="/ticket-summary" element={<TicketSummary />} />
          <Route path="/agent-performance" element={<AgentPerformanceReport />} />
          <Route path="/set-preferences" element={<SetPreferences />} />
          <Route path="/create-article" element={<CreateArticle />} />
          <Route path="/view-articles" element={<ViewArticles />} />
          <Route path="/view-article/:id" element={<ViewArticleDetail />} />
          <Route path="/edit-article/:id" element={<EditArticle />} />
          <Route path="/collect-feedback/:ticketId" element={<CollectFeedback />} />
          <Route path="/view-feedback" element={<ViewFeedback />} />
        </Route>
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.SIGNUP.path} element={<Views.SignUp />} />
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
