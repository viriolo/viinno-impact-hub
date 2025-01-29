import { RouteObject } from "react-router-dom";
import Index from "@/pages/Index";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";
import ImpactCards from "@/pages/impact-cards";
import CreateImpactCard from "@/pages/create-impact-card";
import ImpactCardDetail from "@/pages/impact-card-detail";
import Map from "@/components/Map";
import { ProfilePage } from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import OnboardingPage from "@/pages/onboarding";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { Database } from "@/integrations/supabase/types";

export type AppRoute = RouteObject & {
  requiresAuth?: boolean;
  allowedRoles?: Database["public"]["Enums"]["app_role"][];
  title?: string;
};

export const publicRoutes: AppRoute[] = [
  {
    path: "/",
    element: <Index />,
    title: "Home",
  },
  {
    path: "/login",
    element: <LoginPage />,
    title: "Login",
  },
  {
    path: "/register",
    element: <RegisterPage />,
    title: "Register",
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
    title: "Reset Password",
  },
];

export const protectedRoutes: AppRoute[] = [
  {
    path: "/onboarding",
    element: <OnboardingPage />,
    requiresAuth: true,
    title: "Onboarding",
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor", "csr_funder", "ngo"],
    title: "Dashboard",
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor", "csr_funder", "ngo"],
    title: "Profile",
  },
  {
    path: "/impact-cards",
    element: <ImpactCards />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor", "csr_funder", "ngo"],
    title: "Impact Cards",
  },
  {
    path: "/impact-cards/:id",
    element: <ImpactCardDetail />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor", "csr_funder", "ngo"],
    title: "Impact Card Details",
  },
  {
    path: "/create-impact-card",
    element: <CreateImpactCard />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor"],
    title: "Create Impact Card",
  },
  {
    path: "/map",
    element: <Map />,
    requiresAuth: true,
    allowedRoles: ["scholar", "mentor", "csr_funder", "ngo"],
    title: "Map",
  },
];

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes.map(route => ({
    ...route,
    element: route.requiresAuth ? (
      <ProtectedRoute>
        {route.allowedRoles ? (
          <RoleBasedRoute allowedRoles={route.allowedRoles}>
            {route.element}
          </RoleBasedRoute>
        ) : (
          route.element
        )}
      </ProtectedRoute>
    ) : (
      route.element
    ),
  })),
];
