import { Suspense, lazy } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useRoutes } from "react-router-dom";
import { routes } from "@/config/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load major components
const Hero = lazy(() => import("@/components/Hero").then(module => ({ default: module.Hero })));
const Features = lazy(() => import("@/components/Features").then(module => ({ default: module.Features })));
const Map = lazy(() => import("@/components/Map"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      gcTime: 1000 * 60 * 30, // 30 minutes cache (renamed from cacheTime)
    },
  },
});

function AppRoutes() {
  const routeElements = useRoutes(routes);
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {routeElements}
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider />
            <AppRoutes />
          </AuthProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;