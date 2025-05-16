import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.MAIN.path} element={<Views.Main />}>
          {/* ADD PPRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
          {/* <Route path={PATHS.DASHBOARD.path} element={<Views.Dashboard />} /> */}
          <Route path={PATHS.DASHBOARD.path} element={<Views.TicketDash />} />
          {/* <Route path={PATHS.DASHBOARD.path} element={<Views.KnowBase />} /> */}
        </Route>
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
        <Route path={PATHS.KNOWLEDGE_BASE.path} element={<Views.KnowledgeBase />} />
        <Route path={PATHS.KNOWLEDGE_BASE_USER.path} element={<Views.KnowledgeBaseUser />} />
        <Route path={PATHS.SIGN_IN.path} element={<Views.SignIn />} />
        <Route path={PATHS.ANALYTICS.path} element={<Views.Analytics />} />
        {/* Set KnowledgeBase as the default route */}
        <Route path="/" element={<Views.KnowledgeBase />} />
      </Routes>
    </BrowserRouter>
  );
};
