
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Location {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherMapProps {
  viewType: string;  // "radar" | "satellite"
  layers: string[];  // "rain" | "snow" | "wind" | "storms"
  location: Location;
  timeOffset: number;
}

export const WeatherMap = ({ viewType, layers, location, timeOffset }: WeatherMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapTilerToken, setMapTilerToken] = useState<string>(
    localStorage.getItem('mapTilerToken') || ""
  );
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!mapTilerToken);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (!mapContainer.current || !mapTilerToken) return;

    // Store the token in localStorage for future use
    if (mapTilerToken) {
      localStorage.setItem('mapTilerToken', mapTilerToken);
    }
    
    // Initialize map using MapTiler
    const mapStyle = viewType === 'satellite' 
      ? `https://api.maptiler.com/maps/satellite/style.json?key=${mapTilerToken}`
      : `https://api.maptiler.com/maps/streets/style.json?key=${mapTilerToken}`;
    
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [location.longitude, location.latitude],
      zoom: isMobile ? 8 : 9, // Slightly zoomed out on mobile
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        showCompass: !isMobile,
        showZoom: true,
        visualizePitch: !isMobile
      }),
      'top-left'
    );

    // Add attribution control in a more mobile-friendly position
    map.current.addControl(new maplibregl.AttributionControl({
      compact: isMobile
    }), 'bottom-left');

    // Add a marker for the current location
    new maplibregl.Marker({
      scale: isMobile ? 0.8 : 1 // Slightly smaller marker on mobile
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map.current);

    // Apply weather layers based on selected options
    map.current.on('load', () => {
      // In a real app, we would use actual weather data sources from a weather API
      // For this demo, we're just showing the map with simulated data
      
      if (layers.includes('rain')) {
        // Simulated rain layer - in a real app, would use actual GeoJSON data from a weather API
        map.current?.addSource('rain', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [location.longitude + 0.05, location.latitude - 0.05],
                },
                properties: {
                  intensity: 0.7,
                },
              },
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [location.longitude - 0.1, location.latitude + 0.07],
                },
                properties: {
                  intensity: 0.4,
                },
              }
            ],
          }
        });

        map.current?.addLayer({
          id: 'rain-layer',
          type: 'circle',
          source: 'rain',
          paint: {
            'circle-radius': isMobile ? 50 : 70,
            'circle-color': '#2563eb',
            'circle-opacity': 0.4,
            'circle-blur': 0.8,
          }
        });
      }

      if (layers.includes('storms')) {
        // Simulated storm layer
        map.current?.addSource('storms', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [location.longitude - 0.2, location.latitude - 0.15],
                },
                properties: {
                  intensity: 0.9,
                },
              }
            ],
          }
        });

        map.current?.addLayer({
          id: 'storm-layer',
          type: 'circle',
          source: 'storms',
          paint: {
            'circle-radius': isMobile ? 40 : 50,
            'circle-color': '#dc2626',
            'circle-opacity': 0.6,
            'circle-blur': 0.5,
          }
        });
      }
    });

    // Enable touch rotation for mobile devices
    if (isMobile) {
      map.current.touchZoomRotate.enableRotation();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapTilerToken, viewType, layers, isMobile]);

  // Update map when time offset changes (for forecast animations)
  useEffect(() => {
    if (!map.current) return;
    
    // In a real app, this would update the map layers with new data based on the time offset
    // For demo purposes, we'll just slightly move the rain layer to simulate movement
    if (map.current.getSource('rain')) {
      const rainSource = map.current.getSource('rain') as maplibregl.GeoJSONSource;
      
      // Shift rain features based on time offset
      const baseFeatures = [
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.longitude + 0.05, location.latitude - 0.05],
          },
          properties: {
            intensity: 0.7,
          },
        },
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.longitude - 0.1, location.latitude + 0.07],
          },
          properties: {
            intensity: 0.4,
          },
        }
      ];
      
      // Move rain slightly east based on time offset
      const shiftedFeatures = baseFeatures.map(feature => {
        const coords = feature.geometry.coordinates as [number, number];
        return {
          ...feature,
          geometry: {
            ...feature.geometry,
            coordinates: [coords[0] + (timeOffset * 0.015), coords[1]]
          }
        };
      });
      
      rainSource.setData({
        type: 'FeatureCollection',
        features: shiftedFeatures as any,
      });
    }
  }, [timeOffset, location]);

  // Handle token input
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapTilerToken.trim().length > 0) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <div className="p-3 md:p-6 flex flex-col items-center justify-center h-full w-full bg-muted/20">
        <Alert className="mb-4 max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>MapTiler API Key Required</AlertTitle>
          <AlertDescription className="text-xs md:text-sm">
            To display the weather radar map, please enter your MapTiler API key.
            You can get a free key at <a href="https://cloud.maptiler.com/account/keys/" target="_blank" rel="noopener noreferrer" className="underline">cloud.maptiler.com</a>.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleTokenSubmit} className="space-y-3 md:space-y-4 w-full max-w-md">
          <Input 
            type="text" 
            value={mapTilerToken} 
            onChange={(e) => setMapTilerToken(e.target.value)} 
            placeholder="Enter your MapTiler API key" 
            className="w-full text-sm"
          />
          <Button type="submit" className="w-full">
            Load Map
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className="w-full h-full min-h-[300px] md:min-h-[400px]" />
  );
};
