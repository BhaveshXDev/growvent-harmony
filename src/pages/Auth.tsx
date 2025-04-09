
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import AuthHeader from "@/components/auth/AuthHeader";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const Auth = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-forest p-4">
      <div className="w-full max-w-md z-10">
        <AuthHeader />
      
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              
              <LoginForm setShowForgotPassword={setShowForgotPassword} />
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>
                  Enter your information to create a new account
                </CardDescription>
              </CardHeader>
              <SignupForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="mt-8 text-white/60 text-sm z-10">
        © 2025 VentiGrow. All rights reserved.
      </div>
      
      {showForgotPassword && (
        <ForgotPasswordForm onClose={() => setShowForgotPassword(false)} />
      )}
    </div>
  );
};

export default Auth;
