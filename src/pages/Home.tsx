import React, { useState } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getRoute } from "../services/mapbox";

export default function Home() {
  const [viewState, setViewState] = useState({
    longitude: -76.61316,
    latitude: 2.43823,
    zoom: 12,
  });

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [route, setRoute] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // Distancia y duración
  const [error, setError] = useState(null);

  const handleMapClick = async (e) => {
    const coords = [e.lngLat.lng, e.lngLat.lat];

    if (!start) {
      // Primer clic: punto de inicio
      setStart(coords);
      setEnd(null);
      setRoute(null);
      setRouteInfo(null);
      setError(null);
    } else if (!end) {
      // Segundo clic: punto final y obtener ruta
      setEnd(coords);
      try {
        const data = await getRoute(start, coords);
        if (data.routes && data.routes.length > 0) {
          const ruta = data.routes[0];
          setRoute(ruta.geometry);
          setRouteInfo({
            distancia: (ruta.distance / 1000).toFixed(2), // km
            duracion: (ruta.duration / 60).toFixed(1), // min
          });
        }
      } catch (err) {
        setError("No se pudo obtener la ruta");
      }
    } else {
      // Tercer clic: reiniciar
      setStart(coords);
      setEnd(null);
      setRoute(null);
      setRouteInfo(null);
      setError(null);
    }
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-4">
        Bienvenido a EcoRuta
      </h1>
      <p className="text-gray-700 mb-6">
        Planifica rutas eco-amigables, registra tus recorridos y gana incentivos.
      </p>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {routeInfo && (
        <div className="bg-white p-4 rounded shadow mb-4">
          <p><strong>Distancia:</strong> {routeInfo.distancia} km</p>
          <p><strong>Duración:</strong> {routeInfo.duracion} min</p>
        </div>
      )}

      <div style={{ height: "80vh" }}>
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          style={{ width: "75%", height: "50%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken="pk.eyJ1Ijoic2FudGlhZ29weCIsImEiOiJjbWU0ZHpoY3IwZ3NvMm9wdXRwdHI2ajd6In0.XLsp5NQ8E_MfK7AwUPi5_Q"
        >
          <NavigationControl position="top-left" />

          {/* Marcador de inicio */}
          {start && <Marker longitude={start[0]} latitude={start[1]} color="red" />}

          {/* Marcador de fin */}
          {end && <Marker longitude={end[0]} latitude={end[1]} color="blue" />}

          {/* Línea de la ruta */}
          {route && (
            <Source id="route" type="geojson" data={{ type: "Feature", geometry: route }}>
              <Layer
                id="route-layer"
                type="line"
                paint={{
                  "line-color": "#ff0000",
                  "line-width": 4,
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  );
}
