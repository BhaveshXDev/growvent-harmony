
// OpenWeatherMap API provides weather data including temperature and humidity
const OPEN_WEATHER_API_KEY = "3cc39e9a87a7da446fbb3c8c8c50510e"; // Updated API key

interface WeatherData {
  temperature: number;
  humidity: number;
  co2: number;
  location?: string;
  description?: string;
  icon?: string;
  feels_like?: number;
  wind_speed?: number;
  uv_index?: number;
  pressure?: number;
  visibility?: number;
  sunrise?: number;
  sunset?: number;
}

export const fetchWeatherByLocation = async (location: string): Promise<WeatherData> => {
  try {
    // Fetch weather data by city name from OpenWeatherMap
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error("Weather API request failed");
    }
    
    const weatherData = await weatherResponse.json();
    
    // For CO2 data, we use a simulated value since this requires specialized sensors
    // In a production app, this would come from an actual CO2 API or IoT devices
    const co2Value = 400 + Math.random() * 100; // Simulate CO2 between 400-500 ppm (normal outdoor levels)
    
    return {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      co2: co2Value,
      location: weatherData.name,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      feels_like: weatherData.main.feels_like,
      wind_speed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
    };
  } catch (error) {
    console.error("Error fetching weather data by location:", error);
    // Return fallback data if API fails
    return {
      temperature: 25 + (Math.random() * 5 - 2.5),
      humidity: 60 + (Math.random() * 10 - 5),
      co2: 450 + (Math.random() * 50),
      location: "Unknown",
      description: "Weather data unavailable",
    };
  }
};

export const fetchWeatherData = async (lat = 40.7128, lon = -74.0060): Promise<WeatherData> => {
  try {
    // Fetch weather data from OpenWeatherMap
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPEN_WEATHER_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error("Weather API request failed");
    }
    
    const weatherData = await weatherResponse.json();
    
    // For CO2 data, we use a simulated value
    const co2Value = 400 + Math.random() * 100; 
    
    return {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      co2: co2Value,
      location: weatherData.name,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      feels_like: weatherData.main.feels_like,
      wind_speed: weatherData.wind.speed,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility,
      sunrise: weatherData.sys.sunrise,
      sunset: weatherData.sys.sunset,
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return fallback data if API fails
    return {
      temperature: 25 + (Math.random() * 5 - 2.5),
      humidity: 60 + (Math.random() * 10 - 5),
      co2: 450 + (Math.random() * 50),
      location: "Unknown",
      description: "Weather data unavailable",
    };
  }
};
