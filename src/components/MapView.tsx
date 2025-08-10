import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import  { MAPBOX_TOKEN } from "../services/mapbox";

mapboxgl.accessToken = MAPBOX_TOKEN;

interface MapViewProps {
  lng: number;
  lat: number;
  zoom?: number;
}

const MapView: React.FC<MapViewProps> = ({ lng, lat, zoom = 12 }) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom
    });

    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

    return () => {
      map.remove();
    };
  }, [lng, lat, zoom]);

  return <div ref={mapContainer} className="w-full h-96" />;
};

export default MapView;
