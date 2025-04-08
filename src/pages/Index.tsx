
import React from "react";
import Header from "@/components/Header";
import WeatherDashboard from "@/components/WeatherDashboard";
import ForecastSection from "@/components/ForecastSection";
import { ThemeProvider } from "@/hooks/use-theme";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col">
          <WeatherDashboard />
          <ForecastSection />
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Index;
