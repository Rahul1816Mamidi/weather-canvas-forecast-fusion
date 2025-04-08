
import React from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Gauge, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const AirQualityPage = () => {
  const { airQuality } = useWeatherStore();

  const getQualityColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-green-500';
      case 'Moderate': return 'text-yellow-500';
      case 'Unhealthy': return 'text-orange-500';
      case 'Very Unhealthy': return 'text-red-500';
      case 'Hazardous': return 'text-purple-500';
      default: return 'text-green-500';
    }
  };
  
  const getQualityEmoji = (status: string) => {
    switch (status) {
      case 'Good': return '😀';
      case 'Moderate': return '🙂';
      case 'Unhealthy': return '😐';
      case 'Very Unhealthy': return '😷';
      case 'Hazardous': return '⚠️';
      default: return '😀';
    }
  };
  
  const getComponentProgressColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage < 33) return 'bg-green-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Air Quality</h1>
            <p className="text-muted-foreground">Current air quality index and pollution levels</p>
          </div>
          <Gauge className="h-6 w-6 text-muted-foreground" />
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="glass col-span-1">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="text-6xl mb-4">{getQualityEmoji(airQuality.status)}</div>
              <div className="relative w-full h-48 flex items-center justify-center">
                <div className="absolute w-full h-full">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path
                      d="M 0,50 A 50,50 0 1,1 100,50"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-muted/30"
                    />
                    <path
                      d={`M 0,50 A 50,50 0 ${airQuality.aqi / 300 > 0.5 ? 1 : 0},1 ${Math.min(100, (airQuality.aqi / 300) * 100)},${50 - Math.sin(Math.PI * Math.min(1, (airQuality.aqi / 300))) * 50}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className={getQualityColor(airQuality.status)}
                    />
                  </svg>
                </div>
                <div className="text-center z-10">
                  <div className="text-5xl font-bold">{airQuality.aqi}</div>
                  <div className={`text-xl font-medium ${getQualityColor(airQuality.status)}`}>{airQuality.status}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass col-span-1 lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-medium mb-4">Air Component Breakdown</h3>
              <div className="grid gap-5">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">PM2.5</span>
                      <span className="text-sm">{airQuality.components.pm25} µg/m³</span>
                    </div>
                    <Progress value={(airQuality.components.pm25 / 50) * 100} className={cn("h-2", getComponentProgressColor(airQuality.components.pm25, 50))} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">PM10</span>
                      <span className="text-sm">{airQuality.components.pm10} µg/m³</span>
                    </div>
                    <Progress value={(airQuality.components.pm10 / 100) * 100} className={cn("h-2", getComponentProgressColor(airQuality.components.pm10, 100))} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">CO</span>
                      <span className="text-sm">{airQuality.components.co} ppm</span>
                    </div>
                    <Progress value={(airQuality.components.co / 10) * 100} className={cn("h-2", getComponentProgressColor(airQuality.components.co, 10))} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">NO2</span>
                      <span className="text-sm">{airQuality.components.no2} ppb</span>
                    </div>
                    <Progress value={(airQuality.components.no2 / 100) * 100} className={cn("h-2", getComponentProgressColor(airQuality.components.no2, 100))} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">O3</span>
                      <span className="text-sm">{airQuality.components.o3} ppb</span>
                    </div>
                    <Progress value={(airQuality.components.o3 / 100) * 100} className={cn("h-2", getComponentProgressColor(airQuality.components.o3, 100))} />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-medium mb-3">Health Recommendations</h3>
                <Accordion type="single" collapsible className="w-full">
                  {airQuality.healthTips.map((tip, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          <span>Health Tip {index + 1}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {tip}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AirQualityPage;
