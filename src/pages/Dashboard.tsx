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
  User,
  RefreshCw,
  CloudSun,
  CloudRain,
  Gauge,
  Eye
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
import { fetchWeatherData, fetchWeatherByLocation } from "@/utils/weatherApi";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const [fanSpeed, setFanSpeed] = useState(3);
  const [sensorData, setSensorData] = useState({
    temperature: 25,
    humidity: 60,
    co2: 650,
    description: "Clear sky",
    icon: "01d",
    feels_like: 27,
    wind_speed: 3.5,
    pressure: 1012,
    visibility: 10000,
    sunrise: 1618720800,
    sunset: 1618770000,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  const fetchRealTimeData = async () => {
    setIsLoading(true);
    try {
      let data;
      
      if (profile && profile.location) {
        data = await fetchWeatherByLocation(profile.location);
        if (data.location) {
          toast({
            title: "Weather updated",
            description: `Weather data from ${data.location}`,
          });
        }
      } else {
        data = await fetchWeatherData();
        if (data.location) {
          toast({
            title: "Weather updated",
            description: `Weather data from ${data.location}`,
          });
        } else {
          toast({
            title: "Weather updated",
            description: "Using default location data",
          });
        }
      }
      
      setSensorData({
        temperature: parseFloat(data.temperature.toFixed(1)),
        humidity: Math.round(data.humidity),
        co2: Math.round(data.co2),
        description: data.description || "Clear sky",
        icon: data.icon || "01d",
        feels_like: data.feels_like || data.temperature + 2,
        wind_speed: data.wind_speed || 3.5,
        pressure: data.pressure || 1012,
        visibility: data.visibility || 10000,
        sunrise: data.sunrise || 1618720800,
        sunset: data.sunset || 1618770000,
      });
      
      const now = new Date();
      setLastUpdated(
        `${now.toLocaleTimeString()} ${now.toLocaleDateString()}`
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Update failed",
        description: "Could not fetch the latest weather data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRealTimeData();
    
    const interval = setInterval(() => {
      fetchRealTimeData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, [profile]);
  
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
  
  const getWeatherIcon = () => {
    const iconCode = sensorData.icon;
    if (!iconCode) return <CloudSun className="h-8 w-8 text-yellow-500" />;
    
    if (iconCode.includes('01')) {
      return <CloudSun className="h-8 w-8 text-yellow-500" />;
    } else if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
      return <CloudSun className="h-8 w-8 text-gray-400" />;
    } else if (iconCode.includes('09') || iconCode.includes('10')) {
      return <CloudRain className="h-8 w-8 text-blue-500" />;
    } else {
      return <CloudSun className="h-8 w-8 text-yellow-500" />;
    }
  };
  
  const formatTime = (timestamp: number) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
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
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchRealTimeData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </div>
      )}
      
      <Card className="overflow-hidden border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center">
              {getWeatherIcon()}
              <span className="ml-2">Current Weather</span>
            </div>
            <span className="text-base font-normal">
              {sensorData.location || "Your Location"}
            </span>
          </CardTitle>
          <CardDescription>
            {sensorData.description ? sensorData.description.charAt(0).toUpperCase() + sensorData.description.slice(1) : "Weather conditions"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border">
              <Thermometer className="mb-1 h-5 w-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="text-2xl font-bold mt-1">{sensorData.temperature}°C</span>
              <span className="text-xs text-muted-foreground">Feels like {sensorData.feels_like}°C</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border">
              <Droplets className="mb-1 h-5 w-5 text-blue-500" />
              <span className="text-sm text-muted-foreground">Humidity</span>
              <span className="text-2xl font-bold mt-1">{sensorData.humidity}%</span>
              <span className="text-xs text-muted-foreground">Relative humidity</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border">
              <Wind className="mb-1 h-5 w-5 text-gray-500" />
              <span className="text-sm text-muted-foreground">Wind</span>
              <span className="text-2xl font-bold mt-1">{sensorData.wind_speed} m/s</span>
              <span className="text-xs text-muted-foreground">Wind speed</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-card rounded-lg border">
              <Gauge className="mb-1 h-5 w-5 text-amber-500" />
              <span className="text-sm text-muted-foreground">CO₂ Levels</span>
              <span className="text-2xl font-bold mt-1">{sensorData.co2} ppm</span>
              <span className="text-xs text-muted-foreground">Carbon dioxide</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="flex items-center p-3 bg-card rounded-lg border">
              <Eye className="h-5 w-5 text-indigo-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Visibility</span>
                <p className="font-medium">{(sensorData.visibility / 1000).toFixed(1)} km</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-card rounded-lg border">
              <Gauge className="h-5 w-5 text-purple-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Pressure</span>
                <p className="font-medium">{sensorData.pressure} hPa</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-card rounded-lg border">
              <CloudSun className="h-5 w-5 text-amber-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Sunrise</span>
                <p className="font-medium">{formatTime(sensorData.sunrise)}</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-card rounded-lg border">
              <CloudSun className="h-5 w-5 text-indigo-500 mr-2" />
              <div>
                <span className="text-sm text-muted-foreground">Sunset</span>
                <p className="font-medium">{formatTime(sensorData.sunset)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
