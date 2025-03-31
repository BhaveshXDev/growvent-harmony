
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("ventiGrowUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // This is a mock login - in a real app, this would call a backend API
      console.log("Login with:", email, password);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a fake user
      const mockUser = {
        id: "user123",
        email,
        name: email.split("@")[0],
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem("ventiGrowUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials. Please try again.");
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // This is a mock signup - in a real app, this would call a backend API
      console.log("Signup with:", email, password, name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a fake user
      const mockUser = {
        id: "user123",
        email,
        name,
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem("ventiGrowUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Could not create account. Please try again.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ventiGrowUser");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
