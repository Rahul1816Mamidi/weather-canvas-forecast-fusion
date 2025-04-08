
import React from "react";
import Header from "@/components/Header";
import WeatherDashboard from "@/components/WeatherDashboard";
import ForecastSection from "@/components/ForecastSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">
        <WeatherDashboard />
        <ForecastSection />
      </main>
    </div>
  );
};

export default Index;
