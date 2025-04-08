import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  AlertTriangle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Fan, 
  ArrowUp, 
  ArrowDown,
  MapPin,
  User
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

const mockSensorData = {
  temperature: 27.5,
  humidity: 62,
  co2: 780,
};

const mockEnergyData = [
  { time: "00:00", usage: 3.2 },
  { time: "04:00", usage: 2.8 },
  { time: "08:00", usage: 4.5 },
  { time: "12:00", usage: 6.2 },
  { time: "16:00", usage: 5.8 },
  { time: "20:00", usage: 4.3 },
  { time: "Now", usage: 3.9 },
];

const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "High Humidity",
    description: "Humidity levels have been above optimal for 2 hours.",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    type: "info",
    title: "Fan Speed Adjusted",
    description: "Fan speed automatically adjusted to optimize temperature.",
    timestamp: "4 hours ago",
  },
];

const Dashboard = () => {
  const { profile } = useAuth();
  const [fanSpeed, setFanSpeed] = useState(3);
  const [sensorData, setSensorData] = useState(mockSensorData);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSensorData({
        temperature: mockSensorData.temperature + (Math.random() * 0.6 - 0.3),
        humidity: mockSensorData.humidity + (Math.random() * 2 - 1),
        co2: mockSensorData.co2 + (Math.random() * 20 - 10),
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleIncreaseFan = () => {
    if (fanSpeed < 5) {
      setFanSpeed(fanSpeed + 1);
    }
  };
  
  const handleDecreaseFan = () => {
    if (fanSpeed > 0) {
      setFanSpeed(fanSpeed - 1);
    }
  };
  
  const getMetricColor = (value: number, type: "temperature" | "humidity" | "co2") => {
    if (type === "temperature") {
      if (value < 18 || value > 30) return "text-red-500";
      if (value < 22 || value > 27) return "text-yellow-500";
      return "text-green-500";
    }
    
    if (type === "humidity") {
      if (value < 30 || value > 80) return "text-red-500";
      if (value < 40 || value > 70) return "text-yellow-500";
      return "text-green-500";
    }
    
    if (type === "co2") {
      if (value > 1000) return "text-red-500";
      if (value > 800) return "text-yellow-500";
      return "text-green-500";
    }
    
    return "text-green-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {profile && (
            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-muted-foreground mt-1">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{profile.name}</span>
              </div>
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-ventiprimary-500" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="gauge-container">
                <Progress 
                  value={(sensorData.temperature / 40) * 100} 
                  className="h-2" 
                />
                <span 
                  className={`text-3xl font-bold ${getMetricColor(sensorData.temperature, "temperature")}`}
                >
                  {sensorData.temperature.toFixed(1)}°C
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Optimal range: 22-27°C
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Droplets className="mr-2 h-5 w-5 text-blue-500" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="gauge-container">
                <Progress 
                  value={sensorData.humidity} 
                  className="h-2" 
                />
                <span 
                  className={`text-3xl font-bold ${getMetricColor(sensorData.humidity, "humidity")}`}
                >
                  {Math.round(sensorData.humidity)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Optimal range: 40-70%
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Wind className="mr-2 h-5 w-5 text-gray-500" />
              CO2 Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="gauge-container">
                <Progress 
                  value={(sensorData.co2 / 1500) * 100} 
                  className="h-2" 
                />
                <span 
                  className={`text-3xl font-bold ${getMetricColor(sensorData.co2, "co2")}`}
                >
                  {Math.round(sensorData.co2)} ppm
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Optimal range: &lt; 800 ppm
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>
            Recent alerts and system notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockAlerts.map((alert) => (
            <Alert 
              key={alert.id} 
              variant={alert.type === "warning" ? "destructive" : "default"}
            >
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>
                <div className="flex flex-col">
                  <span>{alert.description}</span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {alert.timestamp}
                  </span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
          
          {mockAlerts.length === 0 && (
            <div className="py-4 text-center text-muted-foreground">
              No alerts at this time.
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fan className="mr-2 h-5 w-5 text-ventiprimary-500" />
            Fan Control
          </CardTitle>
          <CardDescription>
            Adjust ventilation fan speed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecreaseFan}
              disabled={fanSpeed <= 0}
            >
              <ArrowDown className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-2">
              <div className="relative w-16 h-16">
                <Fan 
                  className={`w-16 h-16 text-ventiprimary-600 ${
                    fanSpeed > 0 ? "animate-spin-slow" : ""
                  }`} 
                  style={{ 
                    animationDuration: fanSpeed > 0 ? `${6 - fanSpeed}s` : "0s" 
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {fanSpeed}
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Fan Speed</span>
                <span className="text-sm text-muted-foreground">
                  Level {fanSpeed}/5
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncreaseFan}
              disabled={fanSpeed >= 5}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
          <CardDescription>
            Power usage trends over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line">
            <TabsList className="mb-4">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="line">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      name="Energy (kWh)"
                      stroke="#4ade80" 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="bar">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="usage" 
                      name="Energy (kWh)"
                      fill="#4ade80" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
