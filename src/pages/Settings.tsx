
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
  Lock,
  Image,
  CalendarDays,
  Activity
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
      <h1 className="text-2xl font-bold text-forest">Settings</h1>
      
      <Tabs defaultValue="thresholds">
        <TabsList className="w-full grid grid-cols-4 bg-softgray">
          <TabsTrigger value="thresholds" className="data-[state=active]:bg-forest data-[state=active]:text-white">Environmental Thresholds</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-forest data-[state=active]:text-white">Notifications</TabsTrigger>
          <TabsTrigger value="account" className="data-[state=active]:bg-forest data-[state=active]:text-white">Account Settings</TabsTrigger>
          <TabsTrigger value="crops" className="data-[state=active]:bg-forest data-[state=active]:text-white">Crop Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="thresholds" className="space-y-4 mt-6">
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Thermometer className="mr-2 h-5 w-5 text-yellow" />
                Temperature Thresholds
              </CardTitle>
              <CardDescription className="text-offwhite">
                Set minimum and maximum acceptable temperature
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                  className="[&_[role=slider]]:bg-forest"
                />
                <p className="text-sm text-muted-foreground">
                  System will alert when temperature is outside this range
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Droplets className="mr-2 h-5 w-5 text-skyblue" />
                Humidity Thresholds
              </CardTitle>
              <CardDescription className="text-offwhite">
                Set minimum and maximum acceptable humidity
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                  className="[&_[role=slider]]:bg-forest"
                />
                <p className="text-sm text-muted-foreground">
                  System will alert when humidity is outside this range
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Wind className="mr-2 h-5 w-5 text-softgray" />
                CO2 Thresholds
              </CardTitle>
              <CardDescription className="text-offwhite">
                Set minimum and maximum acceptable CO2 levels
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
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
                  className="[&_[role=slider]]:bg-forest"
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
              className="bg-forest hover:bg-forest/90 text-white"
              onClick={saveSettings}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Thresholds
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle>Alert Preferences</CardTitle>
              <CardDescription className="text-offwhite">
                Choose how you want to receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-yellow" />
                  <Label htmlFor="app-notifications">App Notifications</Label>
                </div>
                <Switch
                  id="app-notifications"
                  checked={notifications.app}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, app: checked })
                  }
                  className="data-[state=checked]:bg-forest"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-skyblue" />
                  <Label htmlFor="email-notifications">Email Alerts</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, email: checked })
                  }
                  className="data-[state=checked]:bg-forest"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-brown" />
                  <Label htmlFor="sms-notifications">SMS Notifications</Label>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    setNotifications({ ...notifications, sms: checked })
                  }
                  className="data-[state=checked]:bg-forest"
                />
              </div>
              
              {notifications.sms && (
                <div className="space-y-2 pt-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input 
                    id="phone-number" 
                    placeholder="+1 (555) 123-4567" 
                    type="tel" 
                    className="border-softgray focus:border-forest"
                  />
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-forest hover:bg-forest/90 text-white"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle>Alert Types</CardTitle>
              <CardDescription className="text-offwhite">
                Select which types of alerts you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="critical-alerts">Critical Alerts</Label>
                <Switch id="critical-alerts" defaultChecked className="data-[state=checked]:bg-forest" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="warning-alerts">Warning Alerts</Label>
                <Switch id="warning-alerts" defaultChecked className="data-[state=checked]:bg-forest" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="system-alerts">System Notifications</Label>
                <Switch id="system-alerts" defaultChecked className="data-[state=checked]:bg-forest" />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="maintenance-alerts">Maintenance Reminders</Label>
                <Switch id="maintenance-alerts" defaultChecked className="data-[state=checked]:bg-forest" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-forest hover:bg-forest/90 text-white"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Alert Types
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-4 mt-6">
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <UserCircle className="mr-2 h-5 w-5 text-softgray" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="account-name">Full Name</Label>
                <Input id="account-name" defaultValue="John Doe" className="border-softgray focus:border-forest" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-email">Email Address</Label>
                <Input id="account-email" defaultValue="john.doe@example.com" type="email" className="border-softgray focus:border-forest" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-organization">Organization</Label>
                <Input id="account-organization" defaultValue="Green Valley Farms" className="border-softgray focus:border-forest" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-forest hover:bg-forest/90 text-white"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Account
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5 text-yellow" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" className="border-softgray focus:border-forest" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" className="border-softgray focus:border-forest" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" className="border-softgray focus:border-forest" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-forest hover:bg-forest/90 text-white"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="crops" className="space-y-4 mt-6">
          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Image className="mr-2 h-5 w-5 text-lime" />
                Crop Management
              </CardTitle>
              <CardDescription className="text-offwhite">
                Manage your crop details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-3 border rounded-md border-softgray hover:border-forest transition-colors">
                  <img src="/lovable-uploads/203a9937-10dc-42a1-b2f6-13869979ad1e.png" alt="Tomato" className="w-12 h-12 object-contain mr-3" />
                  <div>
                    <h3 className="font-medium">Tomato</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>Planted: May 15, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md border-softgray hover:border-forest transition-colors">
                  <img src="/lovable-uploads/fefd23d2-e29a-4431-9d00-8119cb1230ad.png" alt="Strawberry" className="w-12 h-12 object-contain mr-3" />
                  <div>
                    <h3 className="font-medium">Strawberry</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>Planted: June 10, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md border-softgray hover:border-forest transition-colors">
                  <img src="/lovable-uploads/38497399-1980-4690-97e3-13e7b3b81ff2.png" alt="Cucumber" className="w-12 h-12 object-contain mr-3" />
                  <div>
                    <h3 className="font-medium">Cucumber</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>Planted: April 22, 2025</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center p-3 border rounded-md border-softgray hover:border-forest transition-colors">
                  <img src="/lovable-uploads/a94d2dcd-0de1-40ef-91dc-b40b0602e0ce.png" alt="Chili Peppers" className="w-12 h-12 object-contain mr-3" />
                  <div>
                    <h3 className="font-medium">Chili Peppers</h3>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      <span>Planted: March 30, 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button className="bg-lime hover:bg-lime/90 text-charcoal w-full">
                  + Add New Crop
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-lime">
            <CardHeader className="bg-forest text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-yellow" />
                Crop Growth Tracking
              </CardTitle>
              <CardDescription className="text-offwhite">
                Monitor your crop growth stages
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Tomato Growth</span>
                    <span className="text-sm text-muted-foreground">75%</span>
                  </div>
                  <div className="h-2 bg-softgray rounded-full">
                    <div className="h-2 bg-forest rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Strawberry Growth</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="h-2 bg-softgray rounded-full">
                    <div className="h-2 bg-yellow rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Cucumber Growth</span>
                    <span className="text-sm text-muted-foreground">90%</span>
                  </div>
                  <div className="h-2 bg-softgray rounded-full">
                    <div className="h-2 bg-lime rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Chili Peppers Growth</span>
                    <span className="text-sm text-muted-foreground">60%</span>
                  </div>
                  <div className="h-2 bg-softgray rounded-full">
                    <div className="h-2 bg-brown rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-forest hover:bg-forest/90 text-white"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Update Growth Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
