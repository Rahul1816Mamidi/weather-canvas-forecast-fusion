
import React from "react";
import Header from "@/components/Header";
import WeatherDashboard from "@/components/WeatherDashboard";
import ForecastSection from "@/components/ForecastSection";
import { useWeatherStore } from "@/lib/store";
import { AnimatedBackground } from "@/components/AnimatedBackgrounds";

const Index = () => {
  const { currentWeather } = useWeatherStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col relative">
        <AnimatedBackground condition={currentWeather.condition} className="z-0" />
        <div className="relative z-10">
          <WeatherDashboard />
          <ForecastSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
