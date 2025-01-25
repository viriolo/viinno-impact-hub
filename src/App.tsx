import { Suspense, lazy } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useRoutes } from "react-router-dom";
import { routes } from "@/config/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card, CardContent } from "@/components/ui/card";

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
      gcTime: 1000 * 60 * 30, // 30 minutes cache
    },
  },
});

function FallbackError() {
  return (
    <Card className="m-4">
      <CardContent className="p-4">
        <div className="text-center text-destructive">
          Failed to load route
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner />
    </div>
  );
}

function AppRoutes() {
  const routeElements = useRoutes(routes);
  return (
    <ErrorBoundary fallback={<FallbackError />}>
      <Suspense fallback={<LoadingFallback />}>
        {routeElements}
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <ToastProvider />
            <AppRoutes />
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;