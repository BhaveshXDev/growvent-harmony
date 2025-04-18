import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, 
  Sliders, 
  Settings as SettingsIcon, 
  Sprout, 
  LogOut, 
  UserCircle,
  SunMedium,
  Moon,
  Cloud,
  Bell,
  Apple
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const { logout, user, profile } = useAuth();
  const { toast } = useToast();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const isDark = localStorage.getItem("ventiGrowDarkMode") === "true";
    setIsDarkMode(isDark);
    
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("ventiGrowDarkMode", String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const showNotification = (message: string) => {
    toast({
      title: "Notification",
      description: message,
    });
  };

  const clearNotifications = () => {
    setNotificationCount(0);
    setHasNotifications(false);
    toast({
      title: "Notifications cleared",
      description: "All notifications have been marked as read",
    });
    setNotificationsOpen(false);
  };

  const notifications = [
    {
      id: 1,
      title: "Temperature Alert",
      description: "Greenhouse temperature is above the threshold",
      time: "2 hours ago"
    },
    {
      id: 2,
      title: "Watering Reminder",
      description: "Tomatoes need watering today",
      time: "3 hours ago"
    },
    {
      id: 3,
      title: "System Update",
      description: "New system version available",
      time: "5 hours ago"
    }
  ];

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { path: "/control", label: "Control", icon: <Sliders className="w-5 h-5" /> },
    { path: "/crops", label: "Crops", icon: <Apple className="w-5 h-5" /> },
    { path: "/greenhouse", label: "Greenhouse", icon: <Sprout className="w-5 h-5" /> },
    { path: "/weather", label: "Weather", icon: <Cloud className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <SettingsIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-offwhite dark:bg-charcoal">
      <header className="border-b bg-forest text-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/23529c85-3ed2-4f99-80ae-968d74559753.png" 
              alt="VentiGrow Logo" 
              className="h-8"
            />
            <h1 className="text-xl font-semibold text-white">VentiGrow</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full text-white hover:bg-forest/80"
                >
                  <Bell className="h-5 w-5" />
                  {hasNotifications && (
                    <Badge 
                      className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-yellow text-foreground" 
                      variant="outline"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  <>
                    {notifications.map((notification) => (
                      <DropdownMenuItem 
                        key={notification.id}
                        className="flex flex-col items-start p-3 cursor-pointer"
                        onClick={() => showNotification(notification.description)}
                      >
                        <div className="flex justify-between w-full">
                          <span className="font-medium">{notification.title}</span>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{notification.description}</span>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="justify-center text-center cursor-pointer" 
                      onClick={clearNotifications}
                    >
                      Mark all as read
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="rounded-full text-white hover:bg-forest/80"
            >
              {isDarkMode ? (
                <SunMedium className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-white hover:bg-forest/80"
                >
                  {profile?.profileImageUrl ? (
                    <img 
                      src={profile.profileImageUrl} 
                      alt={profile.name} 
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.name || "User"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/settings" className="w-full">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-6 pb-20">
          {children}
        </div>
      </main>
      
      <footer className="bg-card border-t py-4 text-center text-sm text-muted-foreground">
        © 2025 VentiGrow. All rights reserved.
      </footer>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-charcoal border-t shadow-lg z-50">
        <div className="grid grid-cols-6 px-1 py-2 max-w-screen-xl mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "text-forest font-medium"
                  : "text-charcoal dark:text-softgray hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span className="text-[10px] sm:text-xs mt-1 text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
