import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MapComponentProps {
  userLocation: { lat: number; lng: number };
  showMechanics?: boolean;
}

interface Mechanic {
  id: string;
  business_name?: string;
  latitude: number;
  longitude: number;
  hourly_rate?: number;
  specialties?: string[];
  is_available: boolean;
  profile: {
    first_name?: string;
    last_name?: string;
  };
}

const MapComponent: React.FC<MapComponentProps> = ({ userLocation, showMechanics = true }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    if (mapboxToken && mapContainer.current && userLocation) {
      initializeMap();
    }
  }, [mapboxToken, userLocation]);

  useEffect(() => {
    if (showMechanics && map.current) {
      fetchMechanics();
    }
  }, [showMechanics]);

  const initializeMap = () => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [userLocation.lng, userLocation.lat],
      zoom: 12,
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat([userLocation.lng, userLocation.lat])
      .setPopup(new mapboxgl.Popup().setHTML('<strong>Your Location</strong>'))
      .addTo(map.current);

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  const fetchMechanics = async () => {
    try {
      const { data, error } = await supabase
        .from('mechanic_profiles')
        .select(`
          id,
          business_name,
          latitude,
          longitude,
          hourly_rate,
          specialties,
          is_available,
          profile:profiles(first_name, last_name)
        `)
        .eq('is_available', true)
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (error) throw error;

      setMechanics(data || []);
      addMechanicMarkers(data || []);
    } catch (error) {
      console.error('Error fetching mechanics:', error);
    }
  };

  const addMechanicMarkers = (mechanicsData: Mechanic[]) => {
    if (!map.current) return;

    mechanicsData.forEach((mechanic) => {
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-semibold text-sm">
            ${mechanic.business_name || `${mechanic.profile?.first_name || ''} ${mechanic.profile?.last_name || ''}`}
          </h3>
          ${mechanic.hourly_rate ? `<p class="text-xs text-gray-600">$${mechanic.hourly_rate}/hour</p>` : ''}
          ${mechanic.specialties?.length ? `<p class="text-xs text-gray-600">${mechanic.specialties.join(', ')}</p>` : ''}
          <span class="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Available</span>
        </div>
      `);

      new mapboxgl.Marker({ color: '#10b981' })
        .setLngLat([mechanic.longitude, mechanic.latitude])
        .setPopup(popup)
        .addTo(map.current!);
    });
  };

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      setShowTokenInput(false);
    }
  };

  if (showTokenInput) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center space-y-4">
          <CardHeader>
            <CardTitle>Mapbox Configuration</CardTitle>
          </CardHeader>
          <p className="text-sm text-muted-foreground">
            Enter your Mapbox public token to view the map
          </p>
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
              Load Map
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Get your token from{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
};

export default MapComponent;