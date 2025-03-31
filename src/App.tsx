
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ControlPanel from "./pages/ControlPanel";
import Settings from "./pages/Settings";
import GreenhouseProfile from "./pages/GreenhouseProfile";
import NotFound from "./pages/NotFound";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";

// Layout
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // Changed from 3000 to 4000 for 4-second duration
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {showSplash ? (
              <Routes>
                <Route path="*" element={<SplashScreen />} />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/auth" element={<Auth />} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Dashboard />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/control" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ControlPanel />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Settings />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/greenhouse" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <GreenhouseProfile />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            )}
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
