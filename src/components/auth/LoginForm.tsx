
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CardContent, CardFooter } from "@/components/ui/card";

interface LoginFormProps {
  setShowForgotPassword: (show: boolean) => void;
  handleSocialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const LoginForm = ({ setShowForgotPassword, handleSocialLogin }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, emailConfirmationPending, resendConfirmationEmail } = useAuth();
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
      
      <CardFooter>
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
      </CardFooter>
    </form>
  );
};

export default LoginForm;
