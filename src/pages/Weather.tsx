
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CloudRain, Droplets, Sun, ThermometerSun, Wind } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert as AlertComponent, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Types for weather data
interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    precip_mm: number;
    feelslike_c: number;
    uv: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
    }>;
  };
}

const Weather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<string>("New York"); // Default location

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user location is available from profile
        const userLocation = localStorage.getItem("userLocation");
        const locationToUse = userLocation || location;
        
        const apiKey = "your-api-key"; // Replace with actual API key in production
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${locationToUse}&days=7&aqi=no&alerts=no`
        );
        
        if (!response.ok) {
          throw new Error("Weather data not available");
        }
        
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
        setError("Failed to load weather data. Using mock data instead.");
        
        // Use mock data as fallback
        setWeatherData(mockWeatherData);
      } finally {
        setLoading(false);
      }
    };

    // Use mock data for now
    setWeatherData(mockWeatherData);
    setLoading(false);
    
    // Uncomment to use real API when ready:
    // fetchWeatherData();
  }, [location]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes("rain") || lowerCondition.includes("drizzle")) {
      return <CloudRain className="h-10 w-10 text-blue-500" />;
    } else if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
      return <Sun className="h-10 w-10 text-yellow-500" />;
    } else {
      return <CloudRain className="h-10 w-10 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Weather Forecast</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Weather Forecast</h1>
        <AlertComponent variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </AlertComponent>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Weather Forecast</h1>
      
      {error && (
        <AlertComponent variant="default" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </AlertComponent>
      )}
      
      {weatherData && (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>{weatherData.location.name}, {weatherData.location.country}</CardTitle>
                <CardDescription>Current weather conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg border">
                    <div className="mb-2">
                      {getWeatherIcon(weatherData.current.condition.text)}
                    </div>
                    <h3 className="text-xl font-semibold">{weatherData.current.condition.text}</h3>
                    <p className="text-3xl font-bold mt-2">{weatherData.current.temp_c}°C</p>
                    <p className="text-sm text-muted-foreground">Feels like {weatherData.current.feelslike_c}°C</p>
                  </div>
                  
                  <div className="flex flex-col p-4 bg-card rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Details</h3>
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="flex items-center">
                        <Wind className="h-4 w-4 mr-2" />
                        <span className="text-sm">Wind</span>
                      </div>
                      <span className="text-sm">{weatherData.current.wind_kph} km/h</span>
                      
                      <div className="flex items-center">
                        <Droplets className="h-4 w-4 mr-2" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="text-sm">{weatherData.current.humidity}%</span>
                      
                      <div className="flex items-center">
                        <CloudRain className="h-4 w-4 mr-2" />
                        <span className="text-sm">Precipitation</span>
                      </div>
                      <span className="text-sm">{weatherData.current.precip_mm} mm</span>
                      
                      <div className="flex items-center">
                        <ThermometerSun className="h-4 w-4 mr-2" />
                        <span className="text-sm">UV Index</span>
                      </div>
                      <span className="text-sm">{weatherData.current.uv}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center p-4 bg-card rounded-lg border md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg font-semibold mb-4">Location Information</h3>
                    <div className="w-full">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">City</span>
                        <span>{weatherData.location.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Region</span>
                        <span>{weatherData.location.region}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Country</span>
                        <span>{weatherData.location.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast">
            <Card>
              <CardHeader>
                <CardTitle>7-Day Forecast</CardTitle>
                <CardDescription>Weather forecast for the upcoming week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {weatherData.forecast.forecastday.map((day) => (
                    <div key={day.date} className="flex flex-col items-center p-4 bg-card rounded-lg border">
                      <p className="font-medium">{formatDate(day.date)}</p>
                      <div className="my-2">
                        {getWeatherIcon(day.day.condition.text)}
                      </div>
                      <p className="text-sm text-center mb-2">{day.day.condition.text}</p>
                      <div className="flex justify-between w-full mt-2">
                        <span className="text-sm font-medium">{Math.round(day.day.mintemp_c)}°</span>
                        <span className="text-sm font-medium">{Math.round(day.day.maxtemp_c)}°</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="hourly">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Forecast</CardTitle>
                <CardDescription>Weather conditions throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="inline-flex space-x-4 pb-2 min-w-full">
                    {weatherData.forecast.forecastday[0].hour
                      .filter((_, index) => index % 3 === 0) // Show every 3 hours
                      .map((hour) => {
                        const date = new Date(hour.time);
                        const hourStr = date.getHours();
                        const ampm = hourStr >= 12 ? 'PM' : 'AM';
                        const hour12 = hourStr % 12 || 12;
                        
                        return (
                          <div 
                            key={hour.time} 
                            className="flex flex-col items-center p-4 bg-card rounded-lg border min-w-[100px]"
                          >
                            <p className="font-medium">{hour12} {ampm}</p>
                            <div className="my-2">
                              {getWeatherIcon(hour.condition.text)}
                            </div>
                            <p className="text-lg font-bold">{Math.round(hour.temp_c)}°C</p>
                            <p className="text-xs text-center mt-1">{hour.condition.text}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

// Mock weather data for development
const mockWeatherData: WeatherData = {
  location: {
    name: "Nashik",
    state: "Maharashtra",
    country: "India"
  },
  current: {
    temp_c: 22.5,
    temp_f: 72.5,
    condition: {
      text: "Partly cloudy",
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
    },
    humidity: 65,
    wind_kph: 11.2,
    precip_mm: 0.1,
    feelslike_c: 24.3,
    uv: 4
  },
  forecast: {
    forecastday: [
      {
        date: "2025-01-04",
        day: {
          maxtemp_c: 26.3,
          mintemp_c: 17.2,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          }
        },
        hour: [
          {
            time: "2025-01-04 00:00",
            temp_c: 18.5,
            condition: {
              text: "Clear",
              icon: "//cdn.weatherapi.com/weather/64x64/night/113.png"
            }
          },
          {
            time: "2025-01-04 03:00",
            temp_c: 17.8,
            condition: {
              text: "Clear",
              icon: "//cdn.weatherapi.com/weather/64x64/night/113.png"
            }
          },
          {
            time: "2025-01-04 06:00",
            temp_c: 17.2,
            condition: {
              text: "Clear",
              icon: "//cdn.weatherapi.com/weather/64x64/night/113.png"
            }
          },
          {
            time: "2025-01-04 09:00",
            temp_c: 20.1,
            condition: {
              text: "Sunny",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
            }
          },
          {
            time: "2025-01-04 12:00",
            temp_c: 23.4,
            condition: {
              text: "Sunny",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
            }
          },
          {
            time: "2025-01-04 15:00",
            temp_c: 25.7,
            condition: {
              text: "Sunny",
              icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
            }
          },
          {
            time: "2025-01-04 18:00",
            temp_c: 24.2,
            condition: {
              text: "Partly cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
            }
          },
          {
            time: "2025-01-04 21:00",
            temp_c: 20.8,
            condition: {
              text: "Partly cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/night/116.png"
            }
          }
        ]
      },
      {
        date: "2025-01-04",
        day: {
          maxtemp_c: 28.1,
          mintemp_c: 18.4,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
        },
        hour: Array(24).fill({
          time: "2025-01-04 12:00",
          temp_c: 24.5,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
        })
      },
      {
        date: "2025-01-04",
        day: {
          maxtemp_c: 27.5,
          mintemp_c: 19.2,
          condition: {
            text: "Cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/119.png"
          }
        },
        hour: Array(24).fill({
          time: "2025-01-04 12:00",
          temp_c: 25.0,
          condition: {
            text: "Cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/119.png"
          }
        })
      },
      {
        date: "2025-01-04",
        day: {
          maxtemp_c: 24.8,
          mintemp_c: 18.5,
          condition: {
            text: "Rain",
            icon: "//cdn.weatherapi.com/weather/64x64/day/308.png"
          }
        },
        hour: Array(24).fill({
          time: "2025-01-04 12:00",
          temp_c: 22.0,
          condition: {
            text: "Rain",
            icon: "//cdn.weatherapi.com/weather/64x64/day/308.png"
          }
        })
      },
      {
        date: "2025-01-05",
        day: {
          maxtemp_c: 23.1,
          mintemp_c: 17.9,
          condition: {
            text: "Light rain",
            icon: "//cdn.weatherapi.com/weather/64x64/day/296.png"
          }
        },
        hour: Array(24).fill({
          time: "2025-01-0512:00",
          temp_c: 21.5,
          condition: {
            text: "Light rain",
            icon: "//cdn.weatherapi.com/weather/64x64/day/296.png"
          }
        })
      },
      {
        date: "2025-02-04",
        day: {
          maxtemp_c: 25.2,
          mintemp_c: 18.1,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
        },
        hour: Array(24).fill({
          time: "2023-06-06 12:00",
          temp_c: 23.0,
          condition: {
            text: "Partly cloudy",
            icon: "//cdn.weatherapi.com/weather/64x64/day/116.png"
          }
        })
      },
      {
        date: "2025-02-07",
        day: {
          maxtemp_c: 26.7,
          mintemp_c: 19.3,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          }
        },
        hour: Array(24).fill({
          time: "2025-03-07 12:00",
          temp_c: 25.5,
          condition: {
            text: "Sunny",
            icon: "//cdn.weatherapi.com/weather/64x64/day/113.png"
          }
        })
      }
    ]
  }
};

export default Weather;
