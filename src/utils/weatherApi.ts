
// OpenWeatherMap API provides free weather data including temperature and humidity
// Free API key is used for demo purposes - for production, use your own key
const OPEN_WEATHER_API_KEY = "1d9b1abcff7d3f7b5a4a76dd37eb48e2"; // Free demo key
const CO2_SIGNAL_API_KEY = "672c39b2e2d78e20"; // Free demo key for CO2 data

interface WeatherData {
  temperature: number;
  humidity: number;
  co2: number;
  location?: string;
}

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
    
    // For CO2 data, we use a mock value since free CO2 APIs often require registration
    // In a real app, you would use a proper CO2 API with your registered key
    const co2Value = 400 + Math.random() * 400; // Simulate CO2 between 400-800 ppm
    
    return {
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      co2: co2Value,
      location: weatherData.name
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    // Return fallback data if API fails
    return {
      temperature: 25 + (Math.random() * 5 - 2.5),
      humidity: 60 + (Math.random() * 10 - 5),
      co2: 500 + (Math.random() * 300),
    };
  }
};
