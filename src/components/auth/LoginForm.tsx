
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail, Facebook } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent, CardFooter } from "@/components/ui/card";

interface LoginFormProps {
  setShowForgotPassword: (show: boolean) => void;
}

const LoginForm = ({ setShowForgotPassword }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, emailConfirmationPending, resendConfirmationEmail, signInWithSocialProvider } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await login(loginEmail, loginPassword);
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendConfirmation = async () => {
    if (!loginEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    
    await resendConfirmationEmail(loginEmail);
  };
  
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    try {
      setIsLoading(true);
      await signInWithSocialProvider(provider);
      // Auth state change will handle navigation
    } catch (error) {
      // Error handling is done in the context
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <CardContent className="space-y-4">
        {emailConfirmationPending && (
          <Alert className="mb-4 bg-amber-50 border-amber-200">
            <Mail className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-800">Email confirmation required</AlertTitle>
            <AlertDescription className="text-amber-700">
              Please verify your email address before logging in. 
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-amber-700 font-medium underline ml-1"
                onClick={handleResendConfirmation}
                disabled={isLoading}
              >
                Resend confirmation email
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Enter Your Email" 
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Button
              type="button"
              variant="link"
              className="px-0 text-xs"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot password?
            </Button>
          </div>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Your password" 
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <Button 
          type="submit" 
          className="w-full bg-forest hover:bg-forest/90 text-white" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
        
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="#4285f4"/>
            </svg>
            Google
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSocialLogin('facebook')}
            disabled={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
        </div>
      </CardFooter>
    </form>
  );
};

export default LoginForm;
