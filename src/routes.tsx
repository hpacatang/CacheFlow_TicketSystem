import { BrowserRouter, Route, Routes } from "react-router";
import * as Views from "./views/containers";
import { PATHS } from "./constant";

export const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Set Login as the default route */}
        <Route path="/" element={<Views.Login />} />
        {/* ADD PUBLIC ROUTES HERE (e.g., Login, Sign Up, Forgot Pass, etc. ) */}
        <Route path={PATHS.LOGIN.path} element={<Views.Login />} />
        <Route path={PATHS.LOGOUT.path} element={<Views.Logout />} />
        <Route path={PATHS.KNOWLEDGE_BASE.path} element={<Views.KnowledgeBase />} />
        <Route path={PATHS.SIGN_IN.path} element={<Views.SignIn />} />
        <Route path={PATHS.FORGOT_PASSWORD.path} element={<Views.ForgotPass />} />
        <Route path={PATHS.CONFIRM_PASSWORD.path} element={<Views.ResetPass />} />
        <Route path={PATHS.VERIFY_EMAIL.path} element={<Views.VerifyEmail />} />
        
        {/* ADD PRIVATE ROUTES HERE (Routes that can only access after login like Dashboard, Account Setting, etc.) */}
        <Route path={PATHS.DASHBOARD.path} element={<Views.TicketDash />} />
        <Route path={PATHS.CUSTOMERFEEDBACK.path} element={<Views.CustomerFeedback />} />
        <Route path={PATHS.ANALYTICS.path} element={<Views.Analytics />} />
        <Route path={PATHS.SETTINGS.path} element={<Views.Settings />} />
        <Route path={PATHS.NOTIFICATION.path} element={<Views.Notifications />} />
        <Route path={PATHS.USER_MNGMT.path} element={<Views.UserMngmt />} />
        <Route path={PATHS.ACCESS_CNTRL.path} element={<Views.AccessCntrl />} />
        <Route path={PATHS.SUBMITFEEDBACK.path} element={<Views.SubmitFeedback />} />
        
        {/* 404 catch-all route */}
        <Route path={PATHS.NOT_FOUND.path} element={<Views.NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
