
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWeatherStore } from "@/lib/store";
import { Cloud, CloudRain, Snowflake, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const weatherIcons: Record<string, React.ElementType> = {
  "Sunny": Sun,
  "Cloudy": Cloud,
  "Rainy": CloudRain,
  "Snowy": Snowflake
};

const ForecastSection = () => {
  const { dailyForecast, hourlyForecast } = useWeatherStore();
  
  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-6">Weather Forecast</h2>
      
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {dailyForecast.map((day) => {
              const WeatherIcon = weatherIcons[day.condition] || Sun;
              
              return (
                <Card key={day.date} className="glass overflow-hidden animate-fade-in transition-all hover:scale-105">
                  <CardContent className="p-4 flex flex-col items-center">
                    <div className="text-sm font-medium mb-2">
                      {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                    <WeatherIcon className={cn(
                      "h-10 w-10 my-3",
                      day.condition === "Sunny" && "text-weather-sunny",
                      day.condition === "Cloudy" && "text-weather-cloudy",
                      day.condition === "Rainy" && "text-weather-rainy",
                      day.condition === "Snowy" && "text-weather-snowy"
                    )} />
                    <div className="flex justify-between w-full mt-2">
                      <div className="font-medium">{day.high}°</div>
                      <div className="text-muted-foreground">{day.low}°</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="hourly" className="space-y-6">
          <div className="overflow-x-auto pb-4">
            <div className="flex space-x-4 min-w-max">
              {hourlyForecast.map((hour, index) => {
                const WeatherIcon = weatherIcons[hour.condition] || Sun;
                
                return (
                  <Card 
                    key={index} 
                    className="glass w-24 flex-shrink-0 animate-fade-in transition-all hover:scale-105"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-3 flex flex-col items-center">
                      <div className="text-sm">
                        {hour.time}
                      </div>
                      <WeatherIcon className={cn(
                        "h-8 w-8 my-3",
                        hour.condition === "Sunny" && "text-weather-sunny",
                        hour.condition === "Cloudy" && "text-weather-cloudy",
                        hour.condition === "Rainy" && "text-weather-rainy",
                        hour.condition === "Snowy" && "text-weather-snowy"
                      )} />
                      <div className="text-lg font-medium">{hour.temperature}°</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ForecastSection;
