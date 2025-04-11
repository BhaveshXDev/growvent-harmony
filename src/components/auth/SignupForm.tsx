
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Upload, MapPin } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SignupFormProps {
  handleSocialLogin: (provider: 'google' | 'facebook') => Promise<void>;
}

const SignupForm = ({ handleSocialLogin }: SignupFormProps) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [location, setLocation] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signupName || !signupEmail || !signupPassword || !gender || !mobileNumber || !location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (signupPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    
    if (mobileNumber.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid mobile number.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Manually ensure the profile-images bucket exists before signup
      const { data: buckets } = await supabase.storage.listBuckets();
      const profileBucketExists = buckets?.some(bucket => bucket.name === 'profile-images');
      
      if (!profileBucketExists) {
        await supabase.storage.createBucket('profile-images', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
      }
      
      await signup(signupEmail, signupPassword, signupName, profileImage);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from('profiles')
          .update({
            gender: gender,
            mobile: mobileNumber,
            location: location,
          })
          .eq('id', user.id);
      }
      
      toast({
        title: "Success",
        description: "Your account has been created. You can now log in.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImageUrl(imageUrl);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <form onSubmit={handleSignup}>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <Avatar className="w-24 h-24 border-2 border-forest">
              {profileImageUrl ? (
                <AvatarImage src={profileImageUrl} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-muted text-xl">
                  {signupName ? signupName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              )}
            </Avatar>
            <Button
              type="button"
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full bg-forest text-white hover:bg-forest/80"
              onClick={triggerFileInput}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageUpload}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input 
            id="name" 
            placeholder="John Doe" 
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email Address</Label>
          <Input 
            id="signup-email" 
            type="email" 
            placeholder="Enter Your Email" 
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select
            value={gender}
            onValueChange={setGender}
            disabled={isLoading}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Your Location</Label>
          <div className="flex">
            <div className="bg-muted flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <Input 
              id="location" 
              className="rounded-l-none"
              placeholder="Enter your city (e.g., Mumbai, Delhi)" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <div className="flex">
            <div className="bg-muted flex items-center justify-center px-3 border border-r-0 border-input rounded-l-md">
              +91
            </div>
            <Input 
              id="mobile" 
              type="tel" 
              className="rounded-l-none"
              placeholder="xxxxxxxxxx" 
              value={mobileNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setMobileNumber(value);
              }}
              maxLength={10}
              disabled={isLoading}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Input 
              id="signup-password" 
              type={showPassword ? "text" : "password"} 
              placeholder="Create a password" 
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
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
        
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative">
            <Input 
              id="confirm-password" 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
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
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;
