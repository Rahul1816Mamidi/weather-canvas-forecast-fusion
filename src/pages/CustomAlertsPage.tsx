
import React, { useState } from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircle, Trash2, Bell, Thermometer, Wind, Droplets, Gauge, CloudFog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Alert name is required" }),
  type: z.enum(['temperature', 'wind', 'humidity', 'precipitation', 'airQuality']),
  condition: z.enum(['above', 'below', 'equals']),
  value: z.coerce.number(),
  locations: z.array(z.string()).min(1, { message: "Select at least one location" }),
  channels: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
});

const CustomAlertsPage = () => {
  const { customAlerts, savedLocations, addCustomAlert, updateCustomAlert, deleteCustomAlert, toggleCustomAlert } = useWeatherStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAlertId, setEditingAlertId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "temperature",
      condition: "above",
      value: 0,
      locations: [],
      channels: {
        email: true,
        push: true,
        sms: false,
      },
    },
  });

  const handleCreateAlert = (data: z.infer<typeof formSchema>) => {
    if (editingAlertId) {
      updateCustomAlert(editingAlertId, data);
    } else {
      addCustomAlert({
        ...data,
        isActive: true,
      });
    }
    setIsDialogOpen(false);
    setEditingAlertId(null);
    form.reset();
  };

  const handleEdit = (alertId: string) => {
    const alert = customAlerts.find(alert => alert.id === alertId);
    if (alert) {
      form.reset({
        name: alert.name,
        type: alert.type,
        condition: alert.condition,
        value: alert.value,
        locations: alert.locations,
        channels: alert.channels,
      });
      setEditingAlertId(alertId);
      setIsDialogOpen(true);
    }
  };

  const handleDelete = (alertId: string) => {
    deleteCustomAlert(alertId);
  };

  const handleToggle = (alertId: string) => {
    toggleCustomAlert(alertId);
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-5 w-5" />;
      case 'wind': return <Wind className="h-5 w-5" />;
      case 'humidity': return <Droplets className="h-5 w-5" />;
      case 'precipitation': return <CloudFog className="h-5 w-5" />;
      case 'airQuality': return <Gauge className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'above': return 'is above';
      case 'below': return 'is below';
      case 'equals': return 'equals';
      default: return '';
    }
  };
  
  const getUnitByType = (type: string) => {
    switch (type) {
      case 'temperature': return '°C';
      case 'wind': return 'km/h';
      case 'humidity': return '%';
      case 'precipitation': return '%';
      case 'airQuality': return 'AQI';
      default: return '';
    }
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setEditingAlertId(null);
      form.reset();
    }
    setIsDialogOpen(open);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Custom Weather Alerts</h1>
            <p className="text-muted-foreground">Set alerts for specific weather conditions</p>
          </div>
          <Button 
            onClick={() => {
              form.reset();
              setIsDialogOpen(true);
            }}
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span>New Alert</span>
          </Button>
        </div>

        {customAlerts.length === 0 ? (
          <Card className="frosted-glass">
            <CardContent className="py-12 text-center">
              <div className="flex justify-center mb-4">
                <Bell className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No custom alerts</h3>
              <p className="text-muted-foreground mb-6">Create your first alert to get notified when specific weather conditions occur</p>
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span>Create First Alert</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {customAlerts.map((alert) => (
              <Card key={alert.id} className={`transition-all ${!alert.isActive ? 'opacity-70' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                      {getAlertTypeIcon(alert.type)}
                      <span>{alert.name}</span>
                    </div>
                    <Switch 
                      checked={alert.isActive} 
                      onCheckedChange={() => handleToggle(alert.id)}
                    />
                  </div>
                  <CardDescription className="flex items-center">
                    <Badge variant={alert.isActive ? 'default' : 'outline'} className="mr-2">
                      {alert.type}
                    </Badge>
                    {alert.lastTriggered && (
                      <span className="text-xs">
                        Last triggered: {new Date(alert.lastTriggered).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="font-medium">
                    When {alert.type} {getConditionText(alert.condition)} {alert.value}{getUnitByType(alert.type)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {alert.locations.map(location => (
                      <Badge key={location} variant="outline">{location}</Badge>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="flex gap-3">
                    {alert.channels.email && <Badge variant="secondary">Email</Badge>}
                    {alert.channels.push && <Badge variant="secondary">Push</Badge>}
                    {alert.channels.sms && <Badge variant="secondary">SMS</Badge>}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="flex w-full justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(alert.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingAlertId ? 'Edit Alert' : 'Create New Alert'}</DialogTitle>
              <DialogDescription>
                Set up your custom weather alert with specific conditions.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateAlert)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alert Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g., Freezing Temperature Alert" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="temperature">Temperature</SelectItem>
                            <SelectItem value="wind">Wind</SelectItem>
                            <SelectItem value="humidity">Humidity</SelectItem>
                            <SelectItem value="precipitation">Precipitation</SelectItem>
                            <SelectItem value="airQuality">Air Quality</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Condition" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="above">Above</SelectItem>
                            <SelectItem value="below">Below</SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            placeholder="0" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="locations"
                  render={() => (
                    <FormItem>
                      <FormLabel>Locations</FormLabel>
                      <div className="space-y-2">
                        {savedLocations.map((location) => (
                          <div key={location.city} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`location-${location.city}`}
                              checked={form.watch('locations').includes(location.city)}
                              onCheckedChange={(checked) => {
                                const currentLocations = form.getValues('locations');
                                if (checked) {
                                  form.setValue('locations', [...currentLocations, location.city]);
                                } else {
                                  form.setValue('locations', currentLocations.filter(l => l !== location.city));
                                }
                              }}
                            />
                            <label
                              htmlFor={`location-${location.city}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {location.city}, {location.country}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="channels"
                  render={() => (
                    <FormItem>
                      <FormLabel>Notification Channels</FormLabel>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="channel-email"
                            checked={form.watch('channels.email')}
                            onCheckedChange={(checked) => {
                              form.setValue('channels.email', !!checked);
                            }}
                          />
                          <label
                            htmlFor="channel-email"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Email
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="channel-push"
                            checked={form.watch('channels.push')}
                            onCheckedChange={(checked) => {
                              form.setValue('channels.push', !!checked);
                            }}
                          />
                          <label
                            htmlFor="channel-push"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Push
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="channel-sms"
                            checked={form.watch('channels.sms')}
                            onCheckedChange={(checked) => {
                              form.setValue('channels.sms', !!checked);
                            }}
                          />
                          <label
                            htmlFor="channel-sms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            SMS
                          </label>
                        </div>
                      </div>
                      <FormDescription className="text-xs">
                        Select at least one notification channel
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAlertId ? 'Update Alert' : 'Create Alert'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default CustomAlertsPage;
