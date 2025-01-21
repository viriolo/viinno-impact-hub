import { RouteObject } from "react-router-dom";
import Index from "@/pages/Index";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";
import ImpactCards from "@/pages/impact-cards";
import CreateImpactCard from "@/pages/create-impact-card";
import Map from "@/components/Map";
import ProfilePage from "@/pages/profile";
import Dashboard from "@/pages/dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export interface AppRoute extends RouteObject {
  requiresAuth?: boolean;
  title?: string;
  path: string;  // Make path required
  element: React.ReactNode;  // Make element required
}

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
    path: "/dashboard",
    element: <Dashboard />,
    requiresAuth: true,
    title: "Dashboard",
  },
  {
    path: "/profile",
    element: <ProfilePage />,
    requiresAuth: true,
    title: "Profile",
  },
  {
    path: "/impact-cards",
    element: <ImpactCards />,
    requiresAuth: true,
    title: "Impact Cards",
  },
  {
    path: "/create-impact-card",
    element: <CreateImpactCard />,
    requiresAuth: true,
    title: "Create Impact Card",
  },
  {
    path: "/map",
    element: <Map />,
    requiresAuth: true,
    title: "Map",
  },
];

export const routes: RouteObject[] = [
  ...publicRoutes,
  ...protectedRoutes.map(route => ({
    ...route,
    element: route.requiresAuth ? (
      <ProtectedRoute>{route.element}</ProtectedRoute>
    ) : (
      route.element
    ),
  })),
];