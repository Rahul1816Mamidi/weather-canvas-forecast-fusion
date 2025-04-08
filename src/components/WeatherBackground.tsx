
import React from "react";
import { cn } from "@/lib/utils";

interface WeatherBackgroundProps {
  condition: string;
}

export function WeatherBackground({ condition }: WeatherBackgroundProps) {
  const bgClass = React.useMemo(() => {
    switch(condition) {
      case "Sunny":
        return "weather-background-sunny";
      case "Cloudy":
        return "weather-background-cloudy";
      case "Rainy":
        return "weather-background-rainy";
      case "Snowy":
        return "weather-background-snowy";
      default:
        return "weather-background-sunny";
    }
  }, [condition]);

  return (
    <div className={cn("absolute inset-0 w-full h-full -z-10", bgClass)}>
      {condition === "Rainy" && <RainEffect />}
      {condition === "Sunny" && <SunnyEffect />}
      {condition === "Cloudy" && <CloudyEffect />}
      {condition === "Snowy" && <SnowyEffect />}
    </div>
  );
}

function RainEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-blue-200 opacity-60 rounded-full animate-rain-drop"
          style={{
            width: '2px',
            height: '10px',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${1 + Math.random() * 2}s`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
}

function SunnyEffect() {
  return (
    <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-yellow-300 opacity-30 blur-2xl animate-pulse-slow" />
  );
}

function CloudyEffect() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white opacity-40 rounded-full blur-xl animate-float"
          style={{
            width: `${80 + Math.random() * 100}px`,
            height: `${40 + Math.random() * 60}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30}%`,
            animationDuration: `${15 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </>
  );
}

function SnowyEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full opacity-70 animate-float"
          style={{
            width: `${3 + Math.random() * 4}px`,
            height: `${3 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
    </div>
  );
}
