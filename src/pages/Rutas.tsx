import React, { useState } from "react";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getRoute } from "../services/mapbox";
import { useForm, type SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";

type Inputs = {
  nombre:string;
  nombreRequired:string;
  origen_longitud: number;
  origen_longitudRequired: number;
  origen_latitud: number;
  origen_latitudRequired: number;
  destino_longitud: number;
  detino_longitudRequired: number;
  destino_latitud: number;
  detino_latitudRequired: number;
  transporte: string;
  transporteRequired: string;
  fecha_created_at?: string;
};

const Rutas: React.FC = () => {
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
  const { register, handleSubmit, reset } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const fecha = new Date();
    data.fecha_created_at = fecha.toISOString();
    try {
      fetch("http://localhost:3333/rutas", {
        method: "POST",
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Ruta creada");
      reset();
    } catch (e) {
      toast.error("Error al crear la ruta");
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[90vh] p-8">
      {/* Texto */}
      <div className="flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          Planificar ruta
        </h1>
        <div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div  className="flex flex-col justify-center items-center">
              <label className="font-semibold">Nombre de la ruta</label>
              <input
                  type="text"
                  placeholder="Nombre"
                  {...register("nombre", { required: true })}
                  className="border rounded px-3 py-1 flex-1"
                />
            </div>
            {/* Punto de partida */}
            <div className="flex flex-col justify-center items-center">
              <label className="font-semibold">Punto de partida, selecioname en el mapa</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Longitud"
                  {...register("origen_longitud", { required: true })}
                  value={start ? start[0] : ""}
                  readOnly
                  className="border rounded px-3 py-1 flex-1"
                />
                <input
                  type="text"
                  placeholder="Latitud"
                  {...register("origen_latitud", { required: true })}
                  value={start ? start[1] : ""}
                  readOnly
                  className="border rounded px-3 py-1 flex-1"
                />
              </div>
            </div>

            {/* Punto de llegada */}
            <div className="flex flex-col justify-center items-center">
              <label className="font-semibold">Punto de llegada</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  placeholder="Longitud"
                  value={end ? end[0] : ""}
                  {...register("destino_longitud", { required: true })}
                  readOnly
                  className="border rounded px-3 py-1 flex-1"
                />
                <input
                  type="text"
                  placeholder="Latitud"
                  {...register("destino_latitud", { required: true })}
                  value={end ? end[1] : ""}
                  readOnly
                  className="border rounded px-3 py-1 flex-1"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <select
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                {...register("transporte", { required: true })}
              >
                <option value="">Selecciona el transporte</option>
                <option value="bicicleta">Bicicleta</option>
                <option value="caminata">Caminata</option>
                <option value="transporte_publico">Transporte publico</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full py-2 px-4  mt-6 rounded-md text-white 
            bg-green-600`}
              >
                Registrar ruta
              </button>
            </div>

            {routeInfo && (
              <div className="bg-white p-4 rounded-lg shadow border border-green-100">
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
          </form>
        </div>

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
};

export default Rutas;
