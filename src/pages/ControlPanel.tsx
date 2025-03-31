
import { useState } from "react";
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
import { Fan, Sliders, Thermometer, Droplets, Wind, Clock, Save } from "lucide-react";

interface ControlZone {
  id: number;
  name: string;
  fanSpeed: number;
  active: boolean;
}

const defaultZones: ControlZone[] = [
  { id: 1, name: "Zone 1", fanSpeed: 3, active: true },
  { id: 2, name: "Zone 2", fanSpeed: 2, active: true },
  { id: 3, name: "Zone 3", fanSpeed: 4, active: true },
  { id: 4, name: "Zone 4", fanSpeed: 1, active: false },
];

const ControlPanel = () => {
  const { toast } = useToast();
  const [zones, setZones] = useState<ControlZone[]>(defaultZones);
  const [autoMode, setAutoMode] = useState(false);
  const [autoSchedule, setAutoSchedule] = useState({
    morning: 3,
    afternoon: 4,
    evening: 2,
    night: 1,
  });
  
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
