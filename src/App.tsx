
import React, { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./i18n/config"; // Import i18n configuration

// Pages
import SplashScreen from "./pages/SplashScreen";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ControlPanel from "./pages/ControlPanel";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import GreenhouseProfile from "./pages/GreenhouseProfile";
import Weather from "./pages/Weather";
import Crops from "./pages/Crops";
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
    }, 4000); // 4-second duration
    
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
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Profile />
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

                <Route 
                  path="/weather" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Weather />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/crops" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <Crops />
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
