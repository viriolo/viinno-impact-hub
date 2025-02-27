
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";

import Index from "@/pages/Index";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Dashboard from "@/pages/dashboard";
import MentorDashboard from "@/pages/mentor-dashboard";
import CSRDashboard from "@/pages/csr-dashboard";
import NGODashboard from "@/pages/ngo-dashboard";
import Profile from "@/pages/profile";
import Onboarding from "@/pages/onboarding";
import ProjectDiscovery from "@/pages/project-discovery";
import ImpactCards from "@/pages/impact-cards";
import ImpactCardDetail from "@/pages/impact-card-detail";
import CreateImpactCard from "@/pages/create-impact-card";
import EditImpactCard from "@/pages/edit-impact-card";
import Messages from "@/pages/messages";
import ResetPassword from "@/pages/reset-password";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

import "./App.css";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentor-dashboard"
                element={
                  <RoleBasedRoute requiredRole="mentor">
                    <MentorDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/csr-dashboard"
                element={
                  <RoleBasedRoute requiredRole="csr_funder">
                    <CSRDashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/ngo-dashboard"
                element={
                  <RoleBasedRoute requiredRole="ngo">
                    <NGODashboard />
                  </RoleBasedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/project-discovery"
                element={
                  <ProtectedRoute>
                    <ProjectDiscovery />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/impact-cards"
                element={
                  <ProtectedRoute>
                    <ImpactCards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/impact-cards/:id"
                element={
                  <ProtectedRoute>
                    <ImpactCardDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-impact-card"
                element={
                  <ProtectedRoute>
                    <CreateImpactCard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-impact-card/:id"
                element={
                  <ProtectedRoute>
                    <EditImpactCard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
