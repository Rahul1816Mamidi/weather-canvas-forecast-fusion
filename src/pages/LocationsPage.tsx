
import React, { useState } from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MapPin, Search, Star, Trash2, Sun, Cloud, 
  CloudRain, Snowflake, Locate, LocateFixed
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const weatherIcons: Record<string, React.ReactElement> = {
  "Sunny": <Sun className="text-weather-sunny" />,
  "Cloudy": <Cloud className="text-weather-cloudy" />,
  "Rainy": <CloudRain className="text-weather-rainy" />,
  "Snowy": <Snowflake className="text-weather-snowy" />
};

// Mock function to get random weather for each location
const getLocationWeather = () => {
  const conditions = ["Sunny", "Cloudy", "Rainy", "Snowy"];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const temp = Math.floor(Math.random() * 20) + 10;
  
  return { temp, condition };
};

const LocationsPage = () => {
  const { location, savedLocations, changeLocation, toggleFavorite, getCurrentLocation } = useWeatherStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  // For demo - cities to search
  const searchableCities = [
    "New York", "London", "Tokyo", "Paris", "Sydney",
    "Berlin", "Rome", "Madrid", "Beijing", "Dubai",
    "Singapore", "Toronto", "Cairo", "Mumbai", "Moscow"
  ].filter(city => !savedLocations.some(loc => loc.city === city));
  
  const filteredCities = searchQuery 
    ? searchableCities.filter(city => 
        city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  const handleSelectLocation = (city: string) => {
    changeLocation(city);
  };
  
  const handleRemoveLocation = (city: string) => {
    // In a real app, this would remove the location from saved locations
    toast.success(`Removed ${city} from saved locations`);
  };
  
  const handleToggleFavorite = (city: string) => {
    toggleFavorite(city);
    toast.success(`Updated favorites`);
  };
  
  const handleSearch = (city: string) => {
    changeLocation(city);
    setSearchQuery("");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Manage Locations</h1>
            <p className="text-muted-foreground">Your current location is {location.city}, {location.country}</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button variant="outline" onClick={() => getCurrentLocation()} className="flex gap-2 items-center">
              <LocateFixed className="h-4 w-4" />
              <span>Detect Location</span>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex gap-2 items-center">
                  <MapPin className="h-4 w-4" />
                  <span>Add Location</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Search Location</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search cities..." 
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {searchQuery && (
                    <div className="border rounded-md overflow-hidden">
                      {filteredCities.length > 0 ? (
                        <ul className="divide-y">
                          {filteredCities.map((city, index) => (
                            <li 
                              key={index}
                              onClick={() => handleSearch(city)}
                              className="p-2.5 flex items-center cursor-pointer hover:bg-accent"
                            >
                              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>{city}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No cities found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex gap-2 items-center"
                      onClick={() => getCurrentLocation()}
                    >
                      <Locate className="h-4 w-4" />
                      <span>Use current location</span>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedLocations.map((loc, idx) => {
            // Generate random weather for demo purposes
            const { temp, condition } = getLocationWeather();
            const isCurrentLocation = location.city === loc.city;
            
            return (
              <Card 
                key={idx} 
                className={cn(
                  "transition-all hover:scale-[1.02]",
                  isCurrentLocation ? "border-primary" : "glass"
                )}
              >
                <div className="absolute top-3 right-3 flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(loc.city)}
                    className={cn(
                      "h-8 w-8",
                      loc.isFavorite ? "text-yellow-500" : "text-muted-foreground"
                    )}
                  >
                    <Star className="h-4 w-4" fill={loc.isFavorite ? "currentColor" : "none"} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveLocation(loc.city)}
                    className="h-8 w-8 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <CardContent className="pt-6 pb-2">
                  <div className="flex items-start">
                    <div className="text-4xl mr-4">
                      {weatherIcons[condition]}
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">{loc.city}</h3>
                      <p className="text-sm text-muted-foreground">{loc.country}</p>
                      <p className="text-2xl font-bold mt-1">{temp}°</p>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">
                      Latitude: {loc.latitude.toFixed(4)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Longitude: {loc.longitude.toFixed(4)}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={isCurrentLocation ? "secondary" : "default"}
                    onClick={() => handleSelectLocation(loc.city)}
                    disabled={isCurrentLocation}
                  >
                    {isCurrentLocation ? "Current Location" : "Set as Current"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LocationsPage;
