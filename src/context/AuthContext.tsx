
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Profile {
  id: string;
  name: string;
  profileImageUrl?: string;
  gender?: string;
  mobile?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, profileImage?: File) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  updateProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch profile data when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (data) {
          setProfile({
            id: data.id,
            name: data.name || '',
            profileImageUrl: data.profile_image_url,
            gender: data.gender,
            mobile: data.mobile,
            location: data.location,
          });
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
      }
    };

    fetchProfile();
  }, [user]);

  // Setup auth state listener
  useEffect(() => {
    setLoading(true);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Invalid credentials. Please try again.");
    }
  };

  const signup = async (email: string, password: string, name: string, profileImage?: File) => {
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error("User creation failed");
      }

      // If profile image is provided, upload it
      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const filePath = `${authData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, profileImage);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          // Get public URL for the uploaded image
          const { data: publicUrlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

          // Update profile with image URL
          if (publicUrlData) {
            await supabase
              .from('profiles')
              .update({ 
                profile_image_url: publicUrlData.publicUrl 
              })
              .eq('id', authData.user.id);
          }
        }
      }
    } catch (error: any) {
      console.error("Signup failed:", error);
      throw new Error(error.message || "Could not create account. Please try again.");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error("Password reset failed:", error);
      throw new Error(error.message || "Could not send password reset email. Please try again.");
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          gender: data.gender,
          mobile: data.mobile,
          location: data.location,
          profile_image_url: data.profileImageUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local profile state
      setProfile(prev => prev ? { ...prev, ...data } : null);
      
      // If name was updated, we need to update auth metadata
      if (data.name) {
        await supabase.auth.updateUser({
          data: { name: data.name }
        });
      }
    } catch (error: any) {
      console.error("Profile update failed:", error);
      throw new Error(error.message || "Could not update profile. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      session,
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
