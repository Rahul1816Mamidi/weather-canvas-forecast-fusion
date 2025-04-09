import { create } from "zustand";
import { toast } from "sonner";

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  isFavorite?: boolean;
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
  wind: number;
}

interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  precipitation: number;
  wind?: number;
}

interface WeatherAlert {
  id: string;
  type: 'danger' | 'warning' | 'caution';
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  affectedAreas: string[];
  isRead: boolean;
}

interface AirQualityData {
  aqi: number;
  status: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  components: {
    pm25: number;
    pm10: number;
    co: number;
    no2: number;
    o3: number;
  };
  healthTips: string[];
}

interface PollenData {
  overall: number; // 0-5 scale
  types: {
    tree: number;
    grass: number;
    weed: number;
  };
  forecast: { date: string; level: number }[];
}

interface CustomAlert {
  id: string;
  name: string;
  type: 'temperature' | 'wind' | 'humidity' | 'precipitation' | 'airQuality';
  condition: 'above' | 'below' | 'equals';
  value: number;
  locations: string[];  // City names
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  isActive: boolean;
  lastTriggered?: string; // ISO date string
}

interface AppSettings {
  temperatureUnit: 'celsius' | 'fahrenheit';
  windSpeedUnit: 'kmh' | 'mph';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface WeatherStore {
  location: Location;
  currentWeather: CurrentWeather;
  dailyForecast: DailyForecast[];
  hourlyForecast: HourlyForecast[];
  alerts: WeatherAlert[];
  airQuality: AirQualityData;
  pollen: PollenData;
  savedLocations: Location[];
  settings: AppSettings;
  customAlerts: CustomAlert[];
  
  getCurrentLocation: () => void;
  changeLocation: (city: string) => void;
  toggleFavorite: (city: string) => void;
  dismissAlert: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addCustomAlert: (alert: Omit<CustomAlert, 'id'>) => void;
  updateCustomAlert: (id: string, alert: Partial<CustomAlert>) => void;
  deleteCustomAlert: (id: string) => void;
  toggleCustomAlert: (id: string) => void;
}

const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
const cities: Location[] = [
  { city: "New York", country: "USA", latitude: 40.7128, longitude: -74.006 },
  { city: "London", country: "UK", latitude: 51.5074, longitude: -0.1278 },
  { city: "Tokyo", country: "Japan", latitude: 35.6762, longitude: 139.6503 },
  { city: "Paris", country: "France", latitude: 48.8566, longitude: 2.3522 },
  { city: "Sydney", country: "Australia", latitude: -33.8688, longitude: 151.2093 },
];

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
      precipitation: Math.floor(Math.random() * 100),
      wind: Math.floor(Math.random() * 20) + 2
    });
  }
  
  return forecast;
};

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

const generateMockAlerts = (): WeatherAlert[] => {
  const alertTypes: Array<'danger' | 'warning' | 'caution'> = ['danger', 'warning', 'caution'];
  const alertTitles = [
    'Flash Flood Warning',
    'Severe Thunderstorm Watch',
    'Heat Advisory',
    'Wind Advisory',
    'Dense Fog Advisory'
  ];
  const alerts: WeatherAlert[] = [];
  
  for (let i = 0; i < 3; i++) {
    const now = new Date();
    const start = new Date(now);
    start.setHours(start.getHours() + i);
    
    const end = new Date(start);
    end.setHours(end.getHours() + 4 + i);
    
    alerts.push({
      id: `alert-${i}`,
      type: alertTypes[i % alertTypes.length],
      title: alertTitles[i % alertTitles.length],
      description: `This is a ${alertTypes[i % alertTypes.length]} level weather alert. Please take necessary precautions.`,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
      affectedAreas: ['Downtown', 'West Side', 'Eastern Hills'],
      isRead: false
    });
  }
  
  return alerts;
};

const generateMockAirQuality = (): AirQualityData => {
  const aqi = Math.floor(Math.random() * 150) + 1;
  let status: AirQualityData['status'] = 'Good';
  
  if (aqi > 100) status = 'Unhealthy';
  else if (aqi > 50) status = 'Moderate';
  
  return {
    aqi,
    status,
    components: {
      pm25: Math.floor(Math.random() * 50) + 1,
      pm10: Math.floor(Math.random() * 70) + 1,
      co: Math.floor(Math.random() * 10) + 0.5,
      no2: Math.floor(Math.random() * 40) + 1,
      o3: Math.floor(Math.random() * 60) + 1,
    },
    healthTips: [
      'Limit outdoor activities during peak pollution hours',
      'Keep windows closed when air quality is poor',
      'Consider using an air purifier indoors',
      'Stay hydrated and maintain healthy indoor humidity'
    ]
  };
};

const generateMockPollenData = (): PollenData => {
  const forecast = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    forecast.push({
      date: date.toISOString(),
      level: Math.floor(Math.random() * 6)
    });
  }
  
  return {
    overall: Math.floor(Math.random() * 6),
    types: {
      tree: Math.floor(Math.random() * 6),
      grass: Math.floor(Math.random() * 6),
      weed: Math.floor(Math.random() * 6)
    },
    forecast
  };
};

const generateMockCustomAlerts = (): CustomAlert[] => {
  return [
    {
      id: 'custom-1',
      name: 'Freezing Temperature Alert',
      type: 'temperature',
      condition: 'below',
      value: 0,
      locations: ['New York', 'London'],
      channels: {
        email: true,
        push: true,
        sms: false
      },
      isActive: true,
      lastTriggered: new Date(Date.now() - 86400000).toISOString() // 24 hours ago
    },
    {
      id: 'custom-2',
      name: 'High Wind Alert',
      type: 'wind',
      condition: 'above',
      value: 20,
      locations: ['Tokyo'],
      channels: {
        email: true,
        push: false,
        sms: true
      },
      isActive: true
    }
  ];
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  location: cities[0],
  currentWeather: generateRandomWeather(),
  dailyForecast: generateDailyForecast(),
  hourlyForecast: generateHourlyForecast(),
  alerts: generateMockAlerts(),
  airQuality: generateMockAirQuality(),
  pollen: generateMockPollenData(),
  savedLocations: [...cities.slice(0, 3).map(city => ({...city, isFavorite: Math.random() > 0.5}))],
  customAlerts: generateMockCustomAlerts(),
  settings: {
    temperatureUnit: 'celsius',
    windSpeedUnit: 'kmh',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  },
  
  getCurrentLocation: () => {
    toast.promise(
      new Promise<void>((resolve) => {
        setTimeout(() => {
          set((state) => ({
            location: cities[Math.floor(Math.random() * cities.length)],
            currentWeather: generateRandomWeather(),
            dailyForecast: generateDailyForecast(),
            hourlyForecast: generateHourlyForecast(),
            alerts: generateMockAlerts(),
            airQuality: generateMockAirQuality(),
            pollen: generateMockPollenData()
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
      set((state) => ({
        location: newLocation,
        currentWeather: generateRandomWeather(),
        dailyForecast: generateDailyForecast(),
        hourlyForecast: generateHourlyForecast(),
        alerts: generateMockAlerts(),
        airQuality: generateMockAirQuality(),
        pollen: generateMockPollenData()
      }));
      
      toast.success(`Weather updated for ${newLocation.city}`);
    } else {
      toast.error("Location not found");
    }
  },
  
  toggleFavorite: (city: string) => {
    set((state) => {
      const locationIndex = state.savedLocations.findIndex(
        loc => loc.city.toLowerCase() === city.toLowerCase()
      );
      
      if (locationIndex !== -1) {
        const updatedLocations = [...state.savedLocations];
        updatedLocations[locationIndex] = {
          ...updatedLocations[locationIndex],
          isFavorite: !updatedLocations[locationIndex].isFavorite
        };
        
        return { savedLocations: updatedLocations };
      }
      
      const cityToAdd = cities.find(c => c.city.toLowerCase() === city.toLowerCase());
      if (cityToAdd) {
        return { 
          savedLocations: [
            ...state.savedLocations, 
            { ...cityToAdd, isFavorite: true }
          ]
        };
      }
      
      return state;
    });
  },
  
  dismissAlert: (id: string) => {
    set((state) => ({
      alerts: state.alerts.filter(alert => alert.id !== id)
    }));
  },
  
  updateSettings: (newSettings: Partial<AppSettings>) => {
    set((state) => ({
      settings: {
        ...state.settings,
        ...newSettings
      }
    }));
    toast.success("Settings updated");
  },
  
  addCustomAlert: (alert) => {
    set((state) => ({
      customAlerts: [
        ...state.customAlerts,
        {
          ...alert,
          id: `custom-${Date.now()}`
        }
      ]
    }));
    toast.success("Custom alert created");
  },
  
  updateCustomAlert: (id, alert) => {
    set((state) => ({
      customAlerts: state.customAlerts.map(item => 
        item.id === id ? { ...item, ...alert } : item
      )
    }));
    toast.success("Alert updated");
  },
  
  deleteCustomAlert: (id) => {
    set((state) => ({
      customAlerts: state.customAlerts.filter(alert => alert.id !== id)
    }));
    toast.success("Alert deleted");
  },
  
  toggleCustomAlert: (id) => {
    set((state) => ({
      customAlerts: state.customAlerts.map(alert => 
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    }));
  }
}));
