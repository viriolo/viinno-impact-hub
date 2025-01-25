import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useRoutes } from "react-router-dom";
import { routes } from "@/config/routes";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      suspense: true,
    },
  },
});

function AppRoutes() {
  const routeElements = useRoutes(routes);
  return routeElements;
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