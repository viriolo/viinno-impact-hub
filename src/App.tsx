import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { useRoutes } from "react-router-dom";
import { routes } from "@/config/routes";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
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
        <AuthProvider>
          <ToastProvider />
          <AppRoutes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;