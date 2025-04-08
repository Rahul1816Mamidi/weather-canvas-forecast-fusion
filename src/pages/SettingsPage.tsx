
import React from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Thermometer, Wind, Bell, Info, Globe, Mail, Phone, MessageCircle } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const SettingsPage = () => {
  const { settings, updateSettings } = useWeatherStore();
  
  const handleTemperatureUnitChange = (value: 'celsius' | 'fahrenheit') => {
    updateSettings({ temperatureUnit: value });
  };
  
  const handleWindUnitChange = (value: 'kmh' | 'mph') => {
    updateSettings({ windSpeedUnit: value });
  };
  
  const handleNotificationChange = (type: 'email' | 'push' | 'sms', value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: value
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your weather application preferences</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <span>Display Settings</span>
                </CardTitle>
                <CardDescription>Customize how weather data is displayed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme" className="flex items-center gap-2">
                      <span>Theme Mode</span>
                    </Label>
                    <ThemeToggle />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose between light and dark mode
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span>Temperature Unit</span>
                  </Label>
                  <RadioGroup 
                    defaultValue={settings.temperatureUnit}
                    onValueChange={(value) => handleTemperatureUnitChange(value as 'celsius' | 'fahrenheit')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="celsius" id="celsius" />
                      <Label htmlFor="celsius">Celsius (°C)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                      <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wind className="h-4 w-4" />
                    <span>Wind Speed Unit</span>
                  </Label>
                  <RadioGroup 
                    defaultValue={settings.windSpeedUnit}
                    onValueChange={(value) => handleWindUnitChange(value as 'kmh' | 'mph')}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kmh" id="kmh" />
                      <Label htmlFor="kmh">km/h</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mph" id="mph" />
                      <Label htmlFor="mph">mph</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>Manage how you receive weather alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>Email Notifications</span>
                  </Label>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span>Push Notifications</span>
                  </Label>
                  <Switch 
                    id="push-notifications" 
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sms-notifications" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>SMS Notifications</span>
                  </Label>
                  <Switch 
                    id="sms-notifications" 
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>About WeatherCanvas</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center relative">
                    <Sun className="h-10 w-10 text-weather-sunny animate-spin-slow" />
                    <Cloud className="h-14 w-14 text-weather-cloudy absolute -right-3 -top-2" />
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-semibold">WeatherCanvas</h3>
                  <p className="text-sm text-muted-foreground mt-1">Version 1.0.0</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Features</h4>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Real-time weather updates</li>
                    <li>7-day and hourly forecasts</li>
                    <li>Weather alerts and notifications</li>
                    <li>Air quality monitoring</li>
                    <li>Multiple location management</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Contact</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>support@weatherapp.com</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>weathercanvas.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
