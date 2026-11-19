import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import IntroPage from "../features/introduction/pages/IntroPage";
import WelcomePage from "../features/authentication/pages/WelcomePage";
import LoginPage from "../features/authentication/pages/LoginPage";
import SignupPage from "../features/authentication/pages/SignupPage";
import PhoneLoginPage from "../features/authentication/pages/PhoneLoginPage";
import PhoneSignupPage from "../features/authentication/pages/PhoneSignupPage";
import PhoneAuthPage from "../features/authentication/pages/PhoneAuthPage";
import EmailAuthPage from "../features/authentication/pages/EmailAuthPage";
import ForgotPasswordPage from "../features/authentication/pages/ForgotPasswordPage";
import OnboardingPage from "../features/authentication/pages/OnboardingPage";

import RequireAuth from "./guards/RequireAuth";
import RequireGuest from "./guards/RequireGuest";

import MainLayout from "../features/dashboard/layouts/MainLayout";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NutritionPage from "../features/nutrition/pages/NutritionPage";
import ActivityPage from "../features/activity/pages/ActivityPage";
import AiAssistantPage from "../features/ai-assistant/pages/AiAssistantPage";
import CommunityPage from "../features/community/pages/CommunityPage";
import ChatsPage from "../features/chats/pages/ChatsPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import NotificationsPage from "../features/notifications/pages/NotificationsPage";
import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";

import NotFoundPage from "./error/NotFoundPage";
import { ROUTE_PATHS } from "./routes/routePaths";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTE_PATHS.ROOT} element={<IntroPage />} />
        <Route path={ROUTE_PATHS.WELCOME} element={<WelcomePage />} />

        <Route element={<RequireGuest />}>
          <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
          <Route path={ROUTE_PATHS.SIGNUP} element={<SignupPage />} />
          <Route path={ROUTE_PATHS.PHONE_LOGIN} element={<PhoneLoginPage />} />
          <Route path={ROUTE_PATHS.PHONE_SIGNUP} element={<PhoneSignupPage />} />
          <Route path={ROUTE_PATHS.PHONE_AUTH} element={<PhoneAuthPage />} />
          <Route path={ROUTE_PATHS.EMAIL_AUTH} element={<EmailAuthPage />} />
          <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
        </Route>

        {/* Mandatory Onboarding Route */}
        <Route path={ROUTE_PATHS.ONBOARDING} element={<OnboardingPage />} />

        {/* Authenticated Dashboard & Features with MainLayout */}
        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTE_PATHS.NUTRITION} element={<NutritionPage />} />
            <Route path={ROUTE_PATHS.ACTIVITY} element={<ActivityPage />} />
            <Route path={ROUTE_PATHS.AI_ASSISTANT} element={<AiAssistantPage />} />
            <Route path={ROUTE_PATHS.COMMUNITY} element={<CommunityPage />} />
            <Route path={ROUTE_PATHS.CHATS} element={<ChatsPage />} />
            <Route path={ROUTE_PATHS.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTE_PATHS.SETTINGS} element={<SettingsPage />} />
            <Route path={ROUTE_PATHS.NOTIFICATIONS} element={<NotificationsPage />} />
            <Route path={ROUTE_PATHS.ADMIN} element={<AdminDashboardPage />} />
          </Route>
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
