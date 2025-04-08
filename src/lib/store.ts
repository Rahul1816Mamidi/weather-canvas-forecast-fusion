
import { create } from "zustand";
import { toast } from "sonner";

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface CurrentWeather {
  temperature: number;
  condition: string;  // Sunny, Cloudy, Rainy, Snowy
  feelsLike: number;
  humidity: number;
  wind: number;
  high: number;
  low: number;
  airQuality: number;
}

interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  precipitation: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
}

interface WeatherStore {
  location: Location;
  currentWeather: CurrentWeather;
  dailyForecast: DailyForecast[];
  hourlyForecast: HourlyForecast[];
  getCurrentLocation: () => void;
  changeLocation: (city: string) => void;
}

// Mock data
const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
const cities: Location[] = [
  { city: "New York", country: "USA", latitude: 40.7128, longitude: -74.006 },
  { city: "London", country: "UK", latitude: 51.5074, longitude: -0.1278 },
  { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
];

// Generate random weather data for demo purposes
const generateRandomWeather = (): CurrentWeather => {
  const tempBase = Math.floor(Math.random() * 25) + 5;
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    temperature: tempBase,
    condition,
    feelsLike: tempBase + (Math.random() > 0.5 ? 2 : -2),
    humidity: Math.floor(Math.random() * 60) + 30,
    wind: Math.floor(Math.random() * 20) + 2,
    high: tempBase + Math.floor(Math.random() * 5),
    low: tempBase - Math.floor(Math.random() * 5),
    airQuality: Math.floor(Math.random() * 50) + 1
  };
};

// Generate daily forecast
const generateDailyForecast = (): DailyForecast[] => {
  const forecast: DailyForecast[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    forecast.push({
      date: date.toISOString(),
      high: Math.floor(Math.random() * 10) + 20,
      low: Math.floor(Math.random() * 10) + 10,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100)
    });
  }
  
  return forecast;
};

// Generate hourly forecast
const generateHourlyForecast = (): HourlyForecast[] => {
  const forecast: HourlyForecast[] = [];
  const currentHour = new Date().getHours();
  
  for (let i = 0; i < 24; i++) {
    const hour = (currentHour + i) % 24;
    const displayHour = hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`;
    
    forecast.push({
      time: displayHour,
      temperature: Math.floor(Math.random() * 10) + 15,
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      precipitation: Math.floor(Math.random() * 100)
    });
  }
  
  return forecast;
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  location: cities[0],
  currentWeather: generateRandomWeather(),
  dailyForecast: generateDailyForecast(),
  hourlyForecast: generateHourlyForecast(),
  
  getCurrentLocation: () => {
    toast.promise(
      new Promise<void>((resolve) => {
        // Simulate a delay
        setTimeout(() => {
          set(() => ({
            location: cities[Math.floor(Math.random() * cities.length)],
            currentWeather: generateRandomWeather(),
            dailyForecast: generateDailyForecast(),
            hourlyForecast: generateHourlyForecast()
          }));
          resolve();
        }, 1000);
      }),
      {
        loading: 'Getting your location...',
        success: 'Location updated!',
        error: 'Failed to get location'
      }
    );
  },
  
  changeLocation: (city: string) => {
    const newLocation = cities.find(loc => loc.city.toLowerCase() === city.toLowerCase());
    
    if (newLocation) {
      set(() => ({
        location: newLocation,
        currentWeather: generateRandomWeather(),
        dailyForecast: generateDailyForecast(),
        hourlyForecast: generateHourlyForecast()
      }));
      
      toast.success(`Weather updated for ${newLocation.city}`);
    } else {
      toast.error("Location not found");
    }
  }
}));
