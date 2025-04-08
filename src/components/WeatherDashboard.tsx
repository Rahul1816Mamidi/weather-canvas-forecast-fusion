
import React from "react";
import { Cloud, CloudRain, Droplets, LocateFixed, Snowflake, Sun, Thermometer, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useWeatherStore } from "@/lib/store";
import { WeatherBackground } from "./WeatherBackground";
import { cn } from "@/lib/utils";

const WeatherCondition = {
  Sunny: {
    icon: Sun,
    class: "text-weather-sunny",
    animation: "animate-pulse-slow"
  },
  Cloudy: {
    icon: Cloud,
    class: "text-weather-cloudy",
    animation: "animate-float"
  },
  Rainy: {
    icon: CloudRain,
    class: "text-weather-rainy",
    animation: "animate-bounce-slight"
  },
  Snowy: {
    icon: Snowflake,
    class: "text-weather-snowy",
    animation: "animate-spin-slow"
  }
};

const WeatherDashboard = () => {
  const { currentWeather, location, getCurrentLocation } = useWeatherStore();

  // For demo, using condition from store
  const WeatherIcon = WeatherCondition[currentWeather.condition as keyof typeof WeatherCondition]?.icon || Sun;
  const iconClass = WeatherCondition[currentWeather.condition as keyof typeof WeatherCondition]?.class || "";
  const animation = WeatherCondition[currentWeather.condition as keyof typeof WeatherCondition]?.animation || "";

  return (
    <div className="relative w-full mb-8">
      <WeatherBackground condition={currentWeather.condition} />
      
      <div className="container relative z-10 pt-4 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">{location.city}</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={getCurrentLocation}
              className="ml-2"
            >
              <LocateFixed className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm opacity-75">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <Card className="glass mb-6 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                <div className="text-6xl md:text-8xl font-bold mb-2">
                  {currentWeather.temperature}°
                </div>
                <div className="text-lg opacity-75">{currentWeather.condition}</div>
                <div className="text-sm">
                  Feels like {currentWeather.feelsLike}°
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <WeatherIcon className={cn("h-24 w-24 md:h-32 md:w-32", iconClass, animation)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="frosted-glass">
            <CardContent className="p-4 flex items-center">
              <Wind className="h-6 w-6 mr-3 text-primary" />
              <div>
                <div className="text-sm opacity-75">Wind</div>
                <div className="font-medium">{currentWeather.wind} km/h</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-glass">
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <Droplets className="h-6 w-6 mr-3 text-primary" />
                <div className="text-sm opacity-75">Humidity</div>
              </div>
              <Progress value={currentWeather.humidity} className="h-2" />
              <div className="mt-2 text-right font-medium">
                {currentWeather.humidity}%
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-glass">
            <CardContent className="p-4 flex items-center">
              <Thermometer className="h-6 w-6 mr-3 text-primary" />
              <div>
                <div className="text-sm opacity-75">High / Low</div>
                <div className="font-medium">
                  {currentWeather.high}° / {currentWeather.low}°
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="frosted-glass">
            <CardContent className="p-4 flex items-center">
              <div className="mr-3 text-primary text-xl">AQI</div>
              <div>
                <div className="text-sm opacity-75">Air Quality</div>
                <div className="font-medium flex items-center">
                  {currentWeather.airQuality} 
                  <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full">
                    Good
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
