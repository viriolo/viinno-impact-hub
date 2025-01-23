import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "@/config/routes";
import { initializeOfflineSupport } from "@/lib/offline";
import { initializePerformanceMonitoring } from "@/lib/performance";
import { Toaster } from "@/components/ui/toaster";

function App() {
  useEffect(() => {
    // Initialize offline support
    initializeOfflineSupport();
    
    // Initialize performance monitoring
    initializePerformanceMonitoring();
  }, []);

  return (
    <>
      <Routes>
        {routes.map((route) => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={route.element} 
          />
        ))}
      </Routes>
      <Toaster />
    </>
  );
}

export default App;