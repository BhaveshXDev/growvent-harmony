
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Thermometer, Wind, AlertTriangle, MapPin, Droplets, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// Define interfaces for weather data
interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  location: string;
  lastUpdated: string;
  icon: string;
}

interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: React.ElementType;
  iconUrl?: string;
}

interface WeatherAlert {
  type: string;
  description: string;
  time: string;
  severity: "low" | "moderate" | "high";
}

const Weather = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [forecastView, setForecastView] = useState<"daily" | "hourly">("daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Weather data states
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>({
    temp: 24,
    condition: "Sunny",
    humidity: 45,
    windSpeed: 10,
    precipitation: 0,
    location: user?.location || "Bangalore, India",
    lastUpdated: "Just now",
    icon: "113", // Default sunny icon code
  });
  
  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: "Mon", date: "Oct 10", high: 26, low: 18, condition: "Sunny", icon: Sun },
    { day: "Tue", date: "Oct 11", high: 25, low: 17, condition: "Cloudy", icon: Cloud },
    { day: "Wed", date: "Oct 12", high: 23, low: 18, condition: "Rainy", icon: CloudRain },
    { day: "Thu", date: "Oct 13", high: 24, low: 19, condition: "Cloudy", icon: Cloud },
    { day: "Fri", date: "Oct 14", high: 26, low: 20, condition: "Sunny", icon: Sun },
    { day: "Sat", date: "Oct 15", high: 27, low: 21, condition: "Sunny", icon: Sun },
    { day: "Sun", date: "Oct 16", high: 26, low: 20, condition: "Cloudy", icon: Cloud },
  ]);
  
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([
    {
      type: "Heavy Rain Warning",
      description: "Heavy rainfall expected tomorrow night. Ensure greenhouse ventilation is properly configured.",
      time: "In 28 hours",
      severity: "moderate"
    }
  ]);

  // Function to fetch real weather data
  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = user?.location || "Bangalore";
      // Using the WeatherAPI.com service
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=${encodeURIComponent(location)}&days=7&aqi=no&alerts=yes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
      
      // For demo purposes, we'll simulate API response
      // In a real app, you would parse the response.json()
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock API response (in a real app, this would be response.json())
      const mockData = {
        location: {
          name: user?.location?.split(',')[0] || "Bangalore",
          region: user?.location?.split(',')[1]?.trim() || "Karnataka",
          country: "India"
        },
        current: {
          temp_c: Math.floor(Math.random() * 10) + 20, // Random temp between 20-30°C
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          },
          humidity: Math.floor(Math.random() * 30) + 40, // Random humidity between 40-70%
          wind_kph: Math.floor(Math.random() * 15) + 5, // Random wind between 5-20 km/h
          precip_mm: Math.random() * 2, // Random precipitation
          last_updated: new Date().toLocaleTimeString()
        },
        forecast: {
          forecastday: Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            const conditions = ["Sunny", "Partly cloudy", "Cloudy", "Light rain", "Moderate rain"];
            const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            const maxTemp = Math.floor(Math.random() * 10) + 20; // Between 20-30
            const minTemp = maxTemp - Math.floor(Math.random() * 8) - 2; // Between 2-10 degrees less than max
            
            return {
              date: date.toISOString().split('T')[0],
              day: {
                maxtemp_c: maxTemp,
                mintemp_c: minTemp,
                condition: {
                  text: randomCondition,
                  icon: `//cdn.weatherapi.com/weather/64x64/day/${randomCondition === "Sunny" ? "113" : 
                                                            randomCondition === "Partly cloudy" ? "116" : 
                                                            randomCondition === "Cloudy" ? "119" : 
                                                            randomCondition === "Light rain" ? "296" : "302"}.png`
                }
              }
            };
          })
        },
        alerts: {
          alert: Math.random() > 0.7 ? [ // 30% chance of alert
            {
              headline: "Heavy Rain Warning",
              desc: "Heavy rainfall expected tomorrow. Ensure greenhouse ventilation is properly configured.",
              effective: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              severity: "Moderate"
            }
          ] : []
        }
      };
      
      // Update current weather
      setCurrentWeather({
        temp: mockData.current.temp_c,
        condition: mockData.current.condition.text,
        humidity: mockData.current.humidity,
        windSpeed: mockData.current.wind_kph,
        precipitation: mockData.current.precip_mm,
        location: `${mockData.location.name}, ${mockData.location.region}`,
        lastUpdated: mockData.current.last_updated,
        icon: mockData.current.condition.icon.split('/').pop()?.split('.')[0] || "113",
      });
      
      // Update forecast
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      const newForecast = mockData.forecast.forecastday.map((day: any) => {
        const date = new Date(day.date);
        const iconMapping: Record<string, React.ElementType> = {
          "Sunny": Sun,
          "Partly cloudy": Cloud,
          "Cloudy": Cloud,
          "Light rain": CloudRain,
          "Moderate rain": CloudRain
        };
        
        return {
          day: days[date.getDay()],
          date: `${months[date.getMonth()]} ${date.getDate()}`,
          high: day.day.maxtemp_c,
          low: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: iconMapping[day.day.condition.text] || Cloud,
          iconUrl: day.day.condition.icon
        };
      });
      
      setForecast(newForecast);
      
      // Update alerts
      if (mockData.alerts.alert.length > 0) {
        const newAlerts = mockData.alerts.alert.map((alert: any) => ({
          type: alert.headline,
          description: alert.desc,
          time: `In ${Math.floor((new Date(alert.effective).getTime() - Date.now()) / (1000 * 60 * 60))} hours`,
          severity: alert.severity.toLowerCase() as "low" | "moderate" | "high"
        }));
        
        setWeatherAlerts(newAlerts);
      } else {
        setWeatherAlerts([]);
      }
      
      toast({
        title: "Weather data updated",
        description: "Latest weather information has been loaded",
      });
      
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError("Failed to fetch weather data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch weather on component mount
  useEffect(() => {
    fetchWeatherData();
    // Set up periodic refresh (every 30 minutes)
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user?.location]);
  
  const handleRefresh = () => {
    fetchWeatherData();
  };

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sun") || conditionLower.includes("clear")) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (conditionLower.includes("rain")) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (conditionLower.includes("cloud")) return <Cloud className="h-8 w-8 text-gray-500" />;
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-forest dark:text-lime">Weather</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Current Weather */}
      <Card className="bg-white dark:bg-charcoal overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-500 to-blue-500 text-white">
          <CardTitle className="flex flex-col sm:flex-row sm:justify-between gap-2">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{currentWeather.location}</span>
            </div>
            <div className="flex items-center">
              {getWeatherIcon(currentWeather.condition)}
              <span className="ml-2">{currentWeather.temp}°C</span>
              <span className="ml-2 text-sm opacity-80">{currentWeather.condition}</span>
            </div>
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
              <Droplets className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm text-muted-foreground">Humidity</span>
              <span className="font-medium">{currentWeather.humidity}%</span>
            </div>
            <div className="flex flex-col items-center">
              <CloudRain className="h-8 w-8 text-blue-600 mb-2" />
              <span className="text-sm text-muted-foreground">Precipitation</span>
              <span className="font-medium">{currentWeather.precipitation} mm</span>
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
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-7 min-w-[700px] md:min-w-0 gap-2">
            {forecast.map((day, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-medium">{day.day}</span>
                <span className="text-xs text-muted-foreground">{day.date}</span>
                {day.iconUrl ? (
                  <img src={day.iconUrl} alt={day.condition} className="w-8 h-8 my-2" />
                ) : (
                  <day.icon className="w-8 h-8 my-2 text-foreground" />
                )}
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
