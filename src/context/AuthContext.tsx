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
  emailConfirmationPending: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, profileImage?: File) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendConfirmationEmail: (email: string) => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  signInWithSocialProvider: (provider: 'google' | 'facebook') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  emailConfirmationPending: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  resendConfirmationEmail: async () => {},
  updateProfile: async () => {},
  signInWithSocialProvider: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailConfirmationPending, setEmailConfirmationPending] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

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
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          setEmailConfirmationPending(true);
          throw new Error("Your email has not been confirmed yet. Please check your inbox or request a new confirmation email.");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw new Error(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Confirmation Email Sent",
        description: "Please check your inbox for the confirmation link.",
      });
    } catch (error: any) {
      console.error("Failed to resend confirmation email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to resend confirmation email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, profileImage?: File) => {
    try {
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

      const { data: buckets } = await supabase.storage.listBuckets();
      const profileBucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
      
      if (!profileBucketExists) {
        await supabase.storage.createBucket('profile-images', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
      }

      if (profileImage) {
        const fileExt = profileImage.name.split('.').pop();
        const filePath = `${authData.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(filePath, profileImage);

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('profile-images')
            .getPublicUrl(filePath);

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
      
      if (data.profileImageUrl) {
        const { data: buckets } = await supabase.storage.listBuckets();
        const profileBucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
        
        if (!profileBucketExists) {
          await supabase.storage.createBucket('profile-images', {
            public: true,
            fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
          });
        }
      }
      
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

      setProfile(prev => prev ? { ...prev, ...data } : null);
      
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

  const signInWithSocialProvider = async (provider: 'google' | 'facebook') => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Login Successful",
        description: `You have successfully signed in with ${provider}.`,
      });
      
      setLoading(false);
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      toast({
        title: "Login Failed",
        description: error.message || `Could not sign in with ${provider}.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      emailConfirmationPending,
      login, 
      signup, 
      logout,
      resetPassword,
      resendConfirmationEmail,
      updateProfile,
      signInWithSocialProvider 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
