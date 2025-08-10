// components/MapView.tsx
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { MAPBOX_TOKEN } from "../services/mapbox";

// Importa el CSS directamente aquí también para asegurar que se cargue
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapViewProps {
  lng: number;
  lat: number;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ lng, lat, zoom = 12 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom,
    });

    // Añadir controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Añadir marcador
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-96 rounded-lg shadow-lg"
      style={{ minHeight: '400px' }} // Asegura una altura mínima
    />
  );
};

export default MapView;