
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Thermometer, Wind, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const Weather = () => {
  const { toast } = useToast();
  const [forecastView, setForecastView] = useState<"daily" | "hourly">("daily");
  
  // Mock data for demo purposes
  const currentWeather = {
    temp: 24,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 10,
    precipitation: 0,
    location: "Bangalore, India",
    lastUpdated: "10 minutes ago"
  };
  
  const forecast = [
    { day: "Mon", date: "Oct 10", high: 26, low: 18, condition: "Sunny", icon: Sun },
    { day: "Tue", date: "Oct 11", high: 25, low: 17, condition: "Cloudy", icon: Cloud },
    { day: "Wed", date: "Oct 12", high: 23, low: 18, condition: "Rainy", icon: CloudRain },
    { day: "Thu", date: "Oct 13", high: 24, low: 19, condition: "Cloudy", icon: Cloud },
    { day: "Fri", date: "Oct 14", high: 26, low: 20, condition: "Sunny", icon: Sun },
    { day: "Sat", date: "Oct 15", high: 27, low: 21, condition: "Sunny", icon: Sun },
    { day: "Sun", date: "Oct 16", high: 26, low: 20, condition: "Cloudy", icon: Cloud },
  ];
  
  const weatherAlerts = [
    {
      type: "Heavy Rain Warning",
      description: "Heavy rainfall expected tomorrow night. Ensure greenhouse ventilation is properly configured.",
      time: "In 28 hours",
      severity: "moderate"
    }
  ];
  
  const handleRefresh = () => {
    toast({
      title: "Weather data updated",
      description: "Latest weather information has been loaded",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest dark:text-lime">Weather</h1>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          Refresh
        </Button>
      </div>
      
      {/* Current Weather */}
      <Card className="bg-white dark:bg-charcoal overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-500 text-white">
          <CardTitle className="flex justify-between">
            <span>{currentWeather.location}</span>
            <span>{currentWeather.temp}°C</span>
          </CardTitle>
          <CardDescription className="text-white/90">
            Updated {currentWeather.lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col items-center">
              <Thermometer className="h-8 w-8 text-yellow-500 mb-2" />
              <span className="text-sm text-muted-foreground">Temperature</span>
              <span className="font-medium">{currentWeather.temp}°C</span>
            </div>
            <div className="flex flex-col items-center">
              <Wind className="h-8 w-8 text-blue-500 mb-2" />
              <span className="text-sm text-muted-foreground">Wind</span>
              <span className="font-medium">{currentWeather.windSpeed} km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <Cloud className="h-8 w-8 text-gray-500 mb-2" />
              <span className="text-sm text-muted-foreground">Humidity</span>
              <span className="font-medium">{currentWeather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <CloudRain className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm text-muted-foreground">Precipitation</span>
              <span className="font-medium">{currentWeather.precipitation}%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-charcoal/80 dark:border-orange-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
              Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {weatherAlerts.map((alert, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge variant="outline" className={
                  alert.severity === "high" ? "border-red-500 text-red-500" :
                  alert.severity === "moderate" ? "border-orange-500 text-orange-500" :
                  "border-yellow-500 text-yellow-500"
                }>
                  {alert.time}
                </Badge>
                <div>
                  <h4 className="font-medium">{alert.type}</h4>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {/* 7-Day Forecast */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>7-Day Forecast</CardTitle>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="daily" 
                onClick={() => setForecastView("daily")}
              >
                Daily
              </TabsTrigger>
              <TabsTrigger 
                value="hourly" 
                onClick={() => setForecastView("hourly")}
              >
                Hourly
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-medium">{day.day}</span>
                <span className="text-xs text-muted-foreground">{day.date}</span>
                <day.icon className="w-8 h-8 my-2 text-foreground" />
                <div className="flex flex-col items-center">
                  <span className="text-sm">{day.high}°</span>
                  <span className="text-xs text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Greenhouse Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Impact on Greenhouse</CardTitle>
          <CardDescription>
            How current weather conditions affect your crops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Ventilation Efficiency</span>
                <span className="text-sm font-medium">82%</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Irrigation Need</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Temperature Stability</span>
                <span className="text-sm font-medium">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Weather;
