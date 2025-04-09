
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Globe, Layers, Umbrella, CloudSnow, Wind, Zap, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WeatherMap } from "@/components/WeatherMap";
import { useMediaQuery } from "@/hooks/use-media-query";

const RadarPage = () => {
  const { location } = useWeatherStore();
  const [activeView, setActiveView] = useState<string>("radar");
  const [activeLayers, setActiveLayers] = useState<string[]>(["rain"]);
  const [timeOffset, setTimeOffset] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<number | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Time slider values (for forecast animations)
  const timeLabels = [
    "-30m", "-15m", "Now", "+15m", "+30m", "+45m", "+1h", "+1h 15m", "+1h 30m", "+2h"
  ];

  const handleLayerToggle = (value: string) => {
    if (activeLayers.includes(value)) {
      setActiveLayers(activeLayers.filter(layer => layer !== value));
    } else {
      setActiveLayers([...activeLayers, value]);
    }
  };

  const togglePlayPause = () => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    if (newIsPlaying) {
      // Start auto-advancing the time slider
      playTimerRef.current = window.setInterval(() => {
        setTimeOffset(prev => {
          const newOffset = prev + 1;
          if (newOffset >= timeLabels.length - 1) {
            // Reset to beginning when we reach the end
            return 0;
          }
          return newOffset;
        });
      }, 1500);
    } else if (playTimerRef.current !== null) {
      // Stop auto-advancing
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (playTimerRef.current !== null) {
        clearInterval(playTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-4 md:py-8 px-3 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Weather Radar & Satellite</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              View real-time weather radar and satellite imagery for {location.city}, {location.country}
            </p>
          </div>
        </div>

        <Tabs defaultValue="radar" className="mb-4 md:mb-6" onValueChange={setActiveView}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="radar" className="flex gap-2 items-center">
              <Map className="h-4 w-4" />
              <span>Radar</span>
            </TabsTrigger>
            <TabsTrigger value="satellite" className="flex gap-2 items-center">
              <Globe className="h-4 w-4" />
              <span>Satellite</span>
            </TabsTrigger>
          </TabsList>
          
          <Card className="mb-4">
            <CardHeader className="pb-3">
              <CardTitle>Map Layers</CardTitle>
              <CardDescription>Select layers to display on the map</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={activeLayers.includes("rain") ? "default" : "outline"} 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={() => handleLayerToggle("rain")}
                  className="flex gap-2 items-center"
                >
                  <Umbrella className="h-4 w-4" />
                  <span>Rain</span>
                </Button>
                <Button 
                  variant={activeLayers.includes("snow") ? "default" : "outline"} 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={() => handleLayerToggle("snow")}
                  className="flex gap-2 items-center"
                >
                  <CloudSnow className="h-4 w-4" />
                  <span>Snow</span>
                </Button>
                <Button 
                  variant={activeLayers.includes("wind") ? "default" : "outline"} 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={() => handleLayerToggle("wind")}
                  className="flex gap-2 items-center"
                >
                  <Wind className="h-4 w-4" />
                  <span>Wind</span>
                </Button>
                <Button 
                  variant={activeLayers.includes("storms") ? "default" : "outline"} 
                  size={isMobile ? "sm" : "sm"} 
                  onClick={() => handleLayerToggle("storms")}
                  className="flex gap-2 items-center"
                >
                  <Zap className="h-4 w-4" />
                  <span>Storms</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-[4/3] sm:aspect-[16/9] w-full relative">
                <WeatherMap 
                  viewType={activeView} 
                  layers={activeLayers} 
                  location={location} 
                  timeOffset={timeOffset}
                />
                
                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button variant="outline" size="icon" className="bg-background/80">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="bg-background/80">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col pt-4 md:pt-6 gap-3 md:gap-4">
              <div className="flex items-center justify-between w-full">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={togglePlayPause}
                  className="mr-2 flex-shrink-0"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Slider 
                  defaultValue={[0]} 
                  max={timeLabels.length - 1} 
                  step={1} 
                  value={[timeOffset]}
                  onValueChange={(values) => setTimeOffset(values[0])}
                  className="flex-1 mx-2" 
                />
                <Badge variant="outline" className="ml-2 flex-shrink-0">
                  {timeLabels[timeOffset]}
                </Badge>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Drag the slider to see forecast animations or press play to animate
              </div>
            </CardFooter>
          </Card>
        </Tabs>

        <Card className="mb-6">
          <CardHeader className="py-3 md:py-4">
            <CardTitle>Weather Radar Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 md:mb-4 text-sm md:text-base">
              This radar displays real-time precipitation, storm cells, and weather patterns for your area.
              Use the layer toggles to customize your view and the time slider to see forecast animations.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-400"></div>
                <span>Light Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-blue-600"></div>
                <span>Moderate Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-purple-600"></div>
                <span>Heavy Rain</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-cyan-200"></div>
                <span>Light Snow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600"></div>
                <span>Storm Cells</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-orange-500"></div>
                <span>High Wind</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RadarPage;
