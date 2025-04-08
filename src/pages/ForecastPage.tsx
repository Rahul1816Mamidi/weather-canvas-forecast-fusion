
import React, { useState } from "react";
import Header from "@/components/Header";
import { WeatherBackground } from "@/components/WeatherBackground";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Cloud, CloudRain, Snowflake, Wind, Droplets } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const weatherIcons: Record<string, React.ReactElement> = {
  "Sunny": <Sun className="text-weather-sunny animate-pulse-slow" />,
  "Cloudy": <Cloud className="text-weather-cloudy animate-float" />,
  "Rainy": <CloudRain className="text-weather-rainy animate-bounce-slight" />,
  "Snowy": <Snowflake className="text-weather-snowy animate-spin-slow" />
};

const ForecastPage = () => {
  const { location, dailyForecast, hourlyForecast, currentWeather } = useWeatherStore();
  const [activeTab, setActiveTab] = useState("daily");
  
  // Format data for temperature chart
  const tempChartData = hourlyForecast.map((hour) => ({
    time: hour.time,
    temperature: hour.temperature,
    condition: hour.condition,
  }));
  
  // Format data for precipitation chart
  const precipChartData = dailyForecast.map((day) => ({
    date: new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' }),
    precipitation: day.precipitation,
  }));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="relative w-full">
        <WeatherBackground condition={currentWeather.condition} />
        
        <div className="container relative z-10 pt-6 pb-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">{location.city} Forecast</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 w-full md:w-auto">
              <TabsTrigger value="daily">Daily Forecast</TabsTrigger>
              <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
              <TabsTrigger value="charts">Weather Charts</TabsTrigger>
            </TabsList>
            
            {/* Daily Forecast */}
            <TabsContent value="daily" className="space-y-6 animate-fade-in">
              <Carousel className="w-full">
                <CarouselContent>
                  {dailyForecast.map((day) => (
                    <CarouselItem key={day.date} className="md:basis-1/3 lg:basis-1/4">
                      <Card className="glass overflow-hidden h-full transition-all hover:scale-105">
                        <CardContent className="p-6 flex flex-col items-center">
                          <div className="text-lg font-medium mb-1">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </div>
                          <div className="my-4 text-5xl">
                            {weatherIcons[day.condition]}
                          </div>
                          <div className="text-3xl font-bold mb-3">{day.high}°</div>
                          <div className="text-xl text-muted-foreground">{day.low}°</div>
                          <div className="flex justify-between w-full mt-4">
                            <div className="flex items-center">
                              <Droplets className="h-4 w-4 mr-1" />
                              <span>{day.precipitation}%</span>
                            </div>
                            <div className="flex items-center">
                              <Wind className="h-4 w-4 mr-1" />
                              <span>{day.wind} km/h</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden md:block">
                  <CarouselPrevious className="left-0" />
                  <CarouselNext className="right-0" />
                </div>
              </Carousel>
            </TabsContent>
            
            {/* Hourly Forecast */}
            <TabsContent value="hourly" className="space-y-6 animate-fade-in">
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-4 min-w-max py-2">
                  {hourlyForecast.map((hour, index) => {
                    // Temperature color gradient
                    const tempColor = hour.temperature < 15 ? 
                      "bg-blue-500" : hour.temperature < 25 ? 
                      "bg-green-500" : "bg-orange-500";
                    
                    return (
                      <Card 
                        key={index} 
                        className="glass w-24 flex-shrink-0 animate-fade-in transition-all hover:scale-105"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="text-sm font-medium">
                            {hour.time}
                          </div>
                          <div className="my-3 text-2xl">
                            {weatherIcons[hour.condition]}
                          </div>
                          <div className="text-lg font-bold">{hour.temperature}°</div>
                          <div className={cn("h-1 w-full mt-2 rounded-full", tempColor)} />
                          <div className="mt-2 text-sm flex items-center">
                            <Droplets className="h-3 w-3 mr-1" />
                            {hour.precipitation}%
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
            
            {/* Charts */}
            <TabsContent value="charts" className="space-y-10 animate-fade-in">
              {/* Temperature Line Chart */}
              <Card className="frosted-glass">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Temperature Trends (24 Hour)</h3>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={{ temperature: { color: '#f97316' } }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={tempChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="temperature"
                            stroke="var(--color-temperature)"
                            strokeWidth={2}
                            dot={{ stroke: 'var(--color-temperature)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, style: { fill: 'var(--color-temperature)' } }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Precipitation Bar Chart */}
              <Card className="frosted-glass">
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Precipitation Forecast (7 Day)</h3>
                  <div className="h-[300px] w-full">
                    <ChartContainer config={{ 
                      precipitation: { 
                        theme: { dark: '#60a5fa', light: '#3b82f6' }
                      }
                    }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={precipChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Bar 
                            dataKey="precipitation" 
                            name="Precipitation (%)" 
                            fill="var(--color-precipitation)" 
                            radius={[4, 4, 0, 0]}
                            className="animate-rain-drop" 
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
