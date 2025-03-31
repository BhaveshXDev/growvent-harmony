
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Save, 
  Bell, 
  Mail, 
  MessageSquare, 
  Thermometer, 
  Droplets, 
  Wind, 
  UserCircle, 
  Lock
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const [temperatureThreshold, setTemperatureThreshold] = useState([18, 27]);
  const [humidityThreshold, setHumidityThreshold] = useState([40, 70]);
  const [co2Threshold, setCo2Threshold] = useState([400, 800]);
  
  const [notifications, setNotifications] = useState({
    app: true,
    email: true,
    sms: false,
  });
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Tabs defaultValue="thresholds">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="thresholds">Environmental Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thresholds" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-red-500" />
                Temperature Thresholds
              </CardTitle>
              <CardDescription>
                Set minimum and maximum acceptable temperature
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Min: {temperatureThreshold[0]}°C</span>
                  <span className="font-medium">Max: {temperatureThreshold[1]}°C</span>
                </div>
                <Slider
                  value={temperatureThreshold}
                  min={10}
                  max={35}
                  step={1}
                  onValueChange={setTemperatureThreshold}
                />
                <p className="text-sm text-muted-foreground">
                  System will alert when temperature is outside this range
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-blue-500" />
                Humidity Thresholds
              </CardTitle>
              <CardDescription>
                Set minimum and maximum acceptable humidity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Min: {humidityThreshold[0]}%</span>
                  <span className="font-medium">Max: {humidityThreshold[1]}%</span>
                </div>
                <Slider
                  value={humidityThreshold}
                  min={20}
                  max={90}
                  step={5}
                  onValueChange={setHumidityThreshold}
                />
                <p className="text-sm text-muted-foreground">
                  System will alert when humidity is outside this range
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wind className="mr-2 h-5 w-5 text-gray-500" />
                CO2 Thresholds
              </CardTitle>
              <CardDescription>
                Set minimum and maximum acceptable CO2 levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Min: {co2Threshold[0]} ppm</span>
                  <span className="font-medium">Max: {co2Threshold[1]} ppm</span>
                </div>
                <Slider
                  value={co2Threshold}
                  min={300}
                  max={1500}
                  step={50}
                  onValueChange={setCo2Threshold}
                />
                <p className="text-sm text-muted-foreground">
                  System will alert when CO2 level is outside this range
                </p>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
              onClick={saveSettings}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Thresholds
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <Label htmlFor="app-notifications">App Notifications</Label>
                </div>
                <Switch
                  id="app-notifications"
                  checked={notifications.app}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, app: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <Label htmlFor="email-notifications">Email Alerts</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, email: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, sms: checked })
                  }
                />
              </div>
              
              {notifications.sms && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input 
                    id="phone-number" 
                    placeholder="+1 (555) 123-4567" 
                    type="tel" 
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>
                Select which types of alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="critical-alerts">Critical Alerts</Label>
                <Switch id="critical-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="warning-alerts">Warning Alerts</Label>
                <Switch id="warning-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">System Notifications</Label>
                <Switch id="system-alerts" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-alerts">Maintenance Reminders</Label>
                <Switch id="maintenance-alerts" defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Alert Types
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserCircle className="mr-2 h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="account-name">Full Name</Label>
                <Input id="account-name" defaultValue="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-email">Email Address</Label>
                <Input id="account-email" defaultValue="john.doe@example.com" type="email" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-organization">Organization</Label>
                <Input id="account-organization" defaultValue="Green Valley Farms" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Account
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
