
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  profileImageUrl?: string;
  gender?: string;
  mobile?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, profileImage?: File) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
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
        location: "Bangalore, India",
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem("ventiGrowUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Invalid credentials. Please try again.");
    }
  };

  const signup = async (email: string, password: string, name: string, profileImage?: File) => {
    try {
      // This is a mock signup - in a real app, this would call a backend API
      console.log("Signup with:", email, password, name);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a fake user with profile image if provided
      let profileImageUrl;
      
      if (profileImage) {
        // In a real app, we would upload the image to storage
        // Here we just create a temporary URL for demo purposes
        profileImageUrl = URL.createObjectURL(profileImage);
      }
      
      const mockUser = {
        id: "user123",
        email,
        name,
        profileImageUrl,
        location: "Bangalore, India",
      };
      
      // Save user to state and localStorage
      setUser(mockUser);
      localStorage.setItem("ventiGrowUser", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Signup failed:", error);
      throw new Error("Could not create account. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // This would normally call an API to send a reset email
      console.log("Reset password for:", email);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - in a real app, this would trigger a password reset email
    } catch (error) {
      console.error("Password reset failed:", error);
      throw new Error("Could not send password reset email. Please try again.");
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error("No user logged in");
      
      // This would normally update the user profile in the backend
      console.log("Update profile:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the user in state and localStorage
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("ventiGrowUser", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Profile update failed:", error);
      throw new Error("Could not update profile. Please try again.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ventiGrowUser");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      resetPassword,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
