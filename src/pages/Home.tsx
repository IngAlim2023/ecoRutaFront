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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[90vh] p-8">
      {/* Texto */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          Bienvenido a EcoRuta
        </h1>
        <p className="text-gray-700 mb-6 text-lg">
          Planifica rutas eco-amigables, registra tus recorridos y gana
          incentivos.
        </p>

        {routeInfo && (
          <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 mb-4">
            <p>
              <strong>Distancia:</strong> {routeInfo.distancia} km
            </p>
            <p>
              <strong>Duración:</strong> {routeInfo.duracion} min
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-500 bg-red-100 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}
      </div>

      {/* Mapa */}
      <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px]">
        <Map
          {...viewState}
          onMove={(evt) => setViewState(evt.viewState)}
          onClick={handleMapClick}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken="pk.eyJ1Ijoic2FudGlhZ29weCIsImEiOiJjbWU0ZHpoY3IwZ3NvMm9wdXRwdHI2ajd6In0.XLsp5NQ8E_MfK7AwUPi5_Q"
        >
          <NavigationControl position="top-left" />
          {start && (
            <Marker longitude={start[0]} latitude={start[1]} color="red" />
          )}
          {end && <Marker longitude={end[0]} latitude={end[1]} color="blue" />}

          {route && (
            <Source
              id="route"
              type="geojson"
              data={{ type: "Feature", geometry: route }}
            >
              <Layer
                id="route-layer"
                type="line"
                paint={{
                  "line-color": "#16a34a",
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
