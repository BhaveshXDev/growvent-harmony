import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { 
  Fan, 
  Sliders, 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock, 
  Save,
  RefreshCw,
  MapPin
} from "lucide-react";
import { fetchWeatherByLocation } from "@/utils/weatherApi";
import { useAuth } from "@/context/AuthContext";

interface ControlZone {
  id: number;
  name: string;
  fanSpeed: number;
  active: boolean;
}

interface SensorData {
  temperature: number;
  humidity: number;
  co2: number;
  location: string;
}

const defaultZones: ControlZone[] = [
  { id: 1, name: "Zone 1", fanSpeed: 3, active: true },
  { id: 2, name: "Zone 2", fanSpeed: 2, active: true },
  { id: 3, name: "Zone 3", fanSpeed: 4, active: true },
  { id: 4, name: "Zone 4", fanSpeed: 1, active: false },
];

const ControlPanel = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const [zones, setZones] = useState<ControlZone[]>(defaultZones);
  const [autoMode, setAutoMode] = useState(false);
  const [autoSchedule, setAutoSchedule] = useState({
    morning: 3,
    afternoon: 4,
    evening: 2,
    night: 1,
  });
  const [sensorData, setSensorData] = useState<SensorData>({
    temperature: 25,
    humidity: 60,
    co2: 650,
    location: "Loading..."
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (profile?.location) {
      fetchSensorData(profile.location);
    } else {
      fetchSensorData("Delhi"); // Fallback location if user has no location set
    }
  }, [profile]);
  
  const fetchSensorData = async (location: string) => {
    setIsLoading(true);
    try {
      const data = await fetchWeatherByLocation(location);
      setSensorData({
        temperature: parseFloat(data.temperature.toFixed(1)),
        humidity: Math.round(data.humidity),
        co2: Math.round(data.co2),
        location: data.location
      });
      
      toast({
        title: "Sensor data updated",
        description: data.location ? `Current readings from ${data.location}` : "Current sensor readings updated",
      });
    } catch (error) {
      console.error("Error fetching sensor data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleZoneChange = (zoneId: number, field: keyof ControlZone, value: any) => {
    setZones(
      zones.map((zone) => 
        zone.id === zoneId ? { ...zone, [field]: value } : zone
      )
    );
  };
  
  const handleScheduleChange = (time: keyof typeof autoSchedule, value: number) => {
    setAutoSchedule({
      ...autoSchedule,
      [time]: value,
    });
  };
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your control settings have been updated.",
    });
  };
  
  const refreshWeatherData = () => {
    if (profile?.location) {
      fetchSensorData(profile.location);
    } else {
      toast({
        title: "Location not set",
        description: "Please update your location in the settings page.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Control Panel</h1>
        
        <div className="flex items-center space-x-2">
          <Label htmlFor="auto-mode" className="cursor-pointer">
            Auto Mode
          </Label>
          <Switch
            id="auto-mode"
            checked={autoMode}
            onCheckedChange={setAutoMode}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sliders className="mr-2 h-5 w-5" />
            Current Sensor Readings
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Live environmental conditions from {sensorData.location || "Unknown Location"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Thermometer className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm font-medium">Temperature</p>
                <p className="text-xl font-bold">{sensorData.temperature}°C</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Droplets className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Humidity</p>
                <p className="text-xl font-bold">{sensorData.humidity}%</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Wind className="h-8 w-8 text-gray-500" />
              <div>
                <p className="text-sm font-medium">CO₂ Level</p>
                <p className="text-xl font-bold">{sensorData.co2} ppm</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshWeatherData}
              disabled={isLoading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="manual" value={autoMode ? "auto" : "manual"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="manual" 
            onClick={() => setAutoMode(false)}
          >
            Manual Control
          </TabsTrigger>
          <TabsTrigger 
            value="auto" 
            onClick={() => setAutoMode(true)}
          >
            Automated Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="manual" className="space-y-4 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {zones.map((zone) => (
              <Card key={zone.id} className={!zone.active ? "opacity-75" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{zone.name}</CardTitle>
                    <Switch
                      checked={zone.active}
                      onCheckedChange={(checked) => 
                        handleZoneChange(zone.id, "active", checked)
                      }
                    />
                  </div>
                  <CardDescription>
                    {zone.active ? "Active" : "Inactive"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center">
                          <Fan className="mr-2 h-4 w-4" />
                          Fan Speed
                        </Label>
                        <span className="text-sm font-medium">
                          {zone.fanSpeed}/5
                        </span>
                      </div>
                      <Slider
                        value={[zone.fanSpeed]}
                        min={0}
                        max={5}
                        step={1}
                        disabled={!zone.active}
                        onValueChange={(values) => 
                          handleZoneChange(zone.id, "fanSpeed", values[0])
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="default" 
              className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
              onClick={saveSettings}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="auto" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Daily Schedule
              </CardTitle>
              <CardDescription>
                Configure fan speeds throughout the day
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Morning (6:00 - 12:00)</Label>
                    <span className="text-sm font-medium">
                      {autoSchedule.morning}/5
                    </span>
                  </div>
                  <Slider
                    value={[autoSchedule.morning]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(values) => 
                      handleScheduleChange("morning", values[0])
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Afternoon (12:00 - 18:00)</Label>
                    <span className="text-sm font-medium">
                      {autoSchedule.afternoon}/5
                    </span>
                  </div>
                  <Slider
                    value={[autoSchedule.afternoon]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(values) => 
                      handleScheduleChange("afternoon", values[0])
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Evening (18:00 - 22:00)</Label>
                    <span className="text-sm font-medium">
                      {autoSchedule.evening}/5
                    </span>
                  </div>
                  <Slider
                    value={[autoSchedule.evening]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(values) => 
                      handleScheduleChange("evening", values[0])
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Night (22:00 - 6:00)</Label>
                    <span className="text-sm font-medium">
                      {autoSchedule.night}/5
                    </span>
                  </div>
                  <Slider
                    value={[autoSchedule.night]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={(values) => 
                      handleScheduleChange("night", values[0])
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Schedule
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sliders className="mr-2 h-5 w-5" />
                Environmental Triggers
              </CardTitle>
              <CardDescription>
                Automatic adjustments based on conditions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <Label>Temperature Control</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-500" />
                    <Label>Humidity Control</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Wind className="h-5 w-5 text-gray-500" />
                    <Label>CO2 Level Control</Label>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="default" 
                className="bg-ventiprimary-500 hover:bg-ventiprimary-600"
                onClick={saveSettings}
              >
                <Save className="mr-2 h-4 w-4" />
                Save Triggers
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlPanel;
