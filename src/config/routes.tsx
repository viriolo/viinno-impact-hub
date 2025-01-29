import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import { lazy } from "react";
import { Database } from "@/integrations/supabase/types";

// Lazy load pages
const Home = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/login"));
const Register = lazy(() => import("@/pages/register"));
const Profile = lazy(() => import("@/pages/profile"));
const NGODashboard = lazy(() => import("@/pages/ngo-dashboard"));
const ProjectDiscovery = lazy(() => import("@/pages/project-discovery"));

type AppRole = Database["public"]["Enums"]["app_role"];

interface ProtectedRouteConfig extends RouteObject {
  allowedRoles?: AppRole[];
  title?: string;
}

export const protectedRoutes: ProtectedRouteConfig[] = [
  {
    path: "/profile",
    element: <Profile />,
    title: "Profile",
  },
  {
    path: "/ngo-dashboard",
    element: <NGODashboard />,
    allowedRoles: ["ngo"],
    title: "Dashboard",
  },
  {
    path: "/project-discovery",
    element: <ProjectDiscovery />,
    allowedRoles: ["csr_funder"],
    title: "Discover Projects",
  },
];

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ngo-dashboard",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRoles={["ngo"]}>
          <NGODashboard />
        </RoleBasedRoute>
      </ProtectedRoute>
    ),
  },
  {
    path: "/project-discovery",
    element: (
      <ProtectedRoute>
        <RoleBasedRoute allowedRoles={["csr_funder"]}>
          <ProjectDiscovery />
        </RoleBasedRoute>
      </ProtectedRoute>
    ),
  },
];