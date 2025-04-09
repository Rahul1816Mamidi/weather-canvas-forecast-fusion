
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "./pages/Index";
import ForecastPage from "./pages/ForecastPage";
import LocationsPage from "./pages/LocationsPage";
import AlertsPage from "./pages/AlertsPage";
import AirQualityPage from "./pages/AirQualityPage";
import SettingsPage from "./pages/SettingsPage";
import CustomAlertsPage from "./pages/CustomAlertsPage";
import RadarPage from "./pages/RadarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/air-quality" element={<AirQualityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/custom-alerts" element={<CustomAlertsPage />} />
            <Route path="/radar" element={<RadarPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
