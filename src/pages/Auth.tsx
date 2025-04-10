import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [providerError, setProviderError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    // This function is kept empty as we're removing social login functionality
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-forest p-4 md:p-6">
      <div className="w-full max-w-md z-10">
        <AuthHeader />
      
        {providerError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{providerError}</AlertDescription>
          </Alert>
        )}
      
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              
              <LoginForm 
                setShowForgotPassword={setShowForgotPassword} 
                handleSocialLogin={handleSocialLogin}
              />
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create a new account
                </CardDescription>
              </CardHeader>
              <SignupForm handleSocialLogin={handleSocialLogin} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 text-white/60 text-sm z-10 text-center">
        © 2025 VentiGrow. All rights reserved.
      </div>
      
      {showForgotPassword && (
        <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Auth;
