
import React from 'react';
import { cn } from '@/lib/utils';

interface RainDropProps {
  delay: number;
  left: string;
  size: number;
}

const RainDrop: React.FC<RainDropProps> = ({ delay, left, size }) => {
  return (
    <div 
      className="absolute top-0 z-0 opacity-70 animate-rain-drop" 
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${0.8 + Math.random() * 1}s`
      }}
    >
      <div 
        className="bg-blue-500/60 rounded-t-full" 
        style={{
          width: `${size}px`,
          height: `${size * 2}px`
        }}
      ></div>
    </div>
  );
};

interface SnowflakeProps {
  delay: number;
  left: string;
  size: number;
}

const Snowflake: React.FC<SnowflakeProps> = ({ delay, left, size }) => {
  return (
    <div 
      className="absolute top-0 z-0 text-white opacity-80 animate-float" 
      style={{
        left,
        animationDelay: `${delay}s`,
        animationDuration: `${4 + Math.random() * 6}s`,
        fontSize: `${size}px`
      }}
    >
      ❄
    </div>
  );
};

interface CloudProps {
  left: string;
  top: string;
  scale: number;
  opacity: number;
  delay: number;
}

const Cloud: React.FC<CloudProps> = ({ left, top, scale, opacity, delay }) => {
  return (
    <div 
      className="absolute z-0 text-gray-200 animate-float" 
      style={{
        left,
        top,
        transform: `scale(${scale})`,
        opacity,
        animationDelay: `${delay}s`,
        animationDuration: `${20 + Math.random() * 20}s`,
      }}
    >
      <svg 
        width="100" 
        height="60" 
        viewBox="0 0 100 60" 
        fill="currentColor"
      >
        <path d="M12.5,40.5 C5.5,40.5 0,35 0,28 C0,22.5 3.5,17.5 8.5,15.5 C8.5,7 15.5,0 24,0 C29.5,0 34.5,3 37.5,7.5 C40,6 43,5 46,5 C54.5,5 61.5,11.5 62,20 C65.5,21 68,24 68,28 C68,32 65.5,35.5 62,36.5 C61.5,40 58.5,42.5 55,42.5 C52.5,42.5 50.5,41 49,39 C47,41 44,42.5 40.5,42.5 C38,42.5 35.5,41.5 33.5,40 C31,42.5 27,44 22.5,44 C18.5,44 15,42.5 12.5,40.5 Z" />
      </svg>
    </div>
  );
};

interface LightningProps {
  delay: number;
  left: string;
  height: string;
}

const Lightning: React.FC<LightningProps> = ({ delay, left, height }) => {
  return (
    <div 
      className="absolute z-0 opacity-0 animate-[lightning_5s_ease-in-out_infinite]" 
      style={{
        left,
        height,
        animationDelay: `${delay}s`,
      }}
    >
      <svg 
        width="20" 
        height="100" 
        viewBox="0 0 20 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M10 0L0 60L8 60L0 100L20 40L12 40L20 0L10 0Z" 
          fill="#F9D71C"
        />
      </svg>
    </div>
  );
};

interface SunRayProps {
  rotation: number;
  delay: number;
  width: string;
}

const SunRay: React.FC<SunRayProps> = ({ rotation, delay, width }) => {
  return (
    <div 
      className="absolute top-1/2 left-1/2 h-1 bg-yellow-300/50 animate-pulse-slow" 
      style={{
        width,
        transform: `translateX(-50%) translateY(-50%) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        animationDelay: `${delay}s`,
      }}
    />
  );
};

interface AnimatedBackgroundProps {
  condition: string;
  className?: string;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  condition, 
  className 
}) => {
  const raindrops = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    delay: Math.random() * 3,
    left: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 2
  }));
  
  const snowflakes = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    left: `${Math.random() * 100}%`,
    size: 8 + Math.random() * 12
  }));
  
  const clouds = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${10 + Math.random() * 30}%`,
    scale: 0.8 + Math.random() * 1.2,
    opacity: 0.4 + Math.random() * 0.4,
    delay: Math.random() * 5
  }));
  
  const lightning = Array.from({ length: 3 }, (_, i) => ({
    id: i,
    delay: 1 + Math.random() * 4,
    left: `${20 + Math.random() * 60}%`,
    height: `${40 + Math.random() * 20}%`
  }));
  
  const sunrays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    rotation: i * 30,
    delay: Math.random(),
    width: `${100 + Math.random() * 50}px`
  }));
  
  const getBackgroundClass = () => {
    switch (condition) {
      case 'Sunny': return 'weather-background-sunny';
      case 'Cloudy': return 'weather-background-cloudy';
      case 'Rainy': return 'weather-background-rainy';
      case 'Snowy': return 'weather-background-snowy';
      default: return 'weather-background-sunny';
    }
  };
  
  return (
    <div className={cn("absolute inset-0 overflow-hidden", getBackgroundClass(), className)}>
      {condition === 'Sunny' && (
        <>
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-48 h-48 rounded-full bg-yellow-300/80 blur-2xl animate-pulse-slow"></div>
          {sunrays.map((ray) => (
            <SunRay key={ray.id} {...ray} />
          ))}
        </>
      )}
      
      {(condition === 'Cloudy' || condition === 'Rainy') && (
        <>
          {clouds.map((cloud) => (
            <Cloud key={cloud.id} {...cloud} />
          ))}
        </>
      )}
      
      {condition === 'Rainy' && (
        <>
          {raindrops.map((drop) => (
            <RainDrop key={drop.id} {...drop} />
          ))}
        </>
      )}
      
      {condition === 'Thunder' && (
        <>
          {clouds.map((cloud) => (
            <Cloud key={cloud.id} {...cloud} />
          ))}
          {lightning.map((bolt) => (
            <Lightning key={bolt.id} {...bolt} />
          ))}
        </>
      )}
      
      {condition === 'Snowy' && (
        <>
          {snowflakes.map((flake) => (
            <Snowflake key={flake.id} {...flake} />
          ))}
        </>
      )}
    </div>
  );
};
