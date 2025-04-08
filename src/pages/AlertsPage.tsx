
import React from "react";
import Header from "@/components/Header";
import { useWeatherStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, AlertTriangle, X } from "lucide-react";

const AlertsPage = () => {
  const { alerts, dismissAlert } = useWeatherStore();

  const getAlertColor = (type: 'danger' | 'warning' | 'caution') => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 border-red-500 text-red-700 dark:text-red-400';
      case 'warning': return 'bg-orange-500/10 border-orange-500 text-orange-700 dark:text-orange-400';
      case 'caution': return 'bg-yellow-500/10 border-yellow-500 text-yellow-700 dark:text-yellow-400';
    }
  };

  const getAlertIcon = (type: 'danger' | 'warning' | 'caution') => {
    return <AlertTriangle className={`h-5 w-5 ${type === 'danger' ? 'text-red-500' : type === 'warning' ? 'text-orange-500' : 'text-yellow-500'}`} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Weather Alerts</h1>
            <p className="text-muted-foreground">Stay informed about severe weather conditions</p>
          </div>
          <Bell className="h-6 w-6 text-muted-foreground" />
        </div>

        {alerts.length === 0 ? (
          <Card className="frosted-glass">
            <CardContent className="py-8 text-center">
              <div className="flex justify-center mb-4">
                <Bell className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No active alerts</h3>
              <p className="text-muted-foreground">You'll be notified when severe weather is approaching</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={alert.id} className={`relative ${getAlertColor(alert.type)} animate-pulse-slow`}>
                <div className="flex items-start">
                  {getAlertIcon(alert.type)}
                  <div className="ml-3 flex-1">
                    <AlertTitle className="font-bold">{alert.title}</AlertTitle>
                    <AlertDescription className="mt-1">
                      {alert.description}
                    </AlertDescription>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-background/50 rounded-full">
                        Starts: {new Date(alert.startsAt).toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded-full">
                        Ends: {new Date(alert.endsAt).toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-background/50 rounded-full">
                        Areas: {alert.affectedAreas.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </Alert>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AlertsPage;
