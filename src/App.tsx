import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { Routes } from "@/config/routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastProvider />
          <Routes />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;