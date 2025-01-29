import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Profile from "@/pages/profile";
import NGODashboard from "@/pages/ngo-dashboard";
import ProjectDiscovery from "@/pages/project-discovery";

const router = createBrowserRouter([
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
]);

export default router;