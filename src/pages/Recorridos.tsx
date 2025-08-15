import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Map, {
  Marker,
  Source,
  Layer,
  NavigationControl,
} from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { getRoute } from "../services/mapbox";
import { useNavigate } from "react-router-dom";

const Recorridos: React.FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  //Rutas
  const [comienzoLongitud, setComienzoLongitud] = useState("");
  const [comienzoLatitud, setComienzoLatitud] = useState("");
  const [destinoLongitud, setDestinoLongitud] = useState("");
  const [destinoLatitud, setDestinoLatitud] = useState("");
  const [routeGeoJson, setRouteGeoJson] = useState(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [calCo2, setCalCo2] = useState<number>(0);
  //Termina Rutas
  const [filtro, setFiltro] = useState<string>("");
  const [verMap, setVerMap] = useState<boolean>(false);

  //id de la ruta:
  const [idRu, setIdRu] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [viewState, setViewState] = useState({
    longitude: -76.61316,
    latitude: 2.43823,
    zoom: 12,
  });

  useEffect(() => {
    const load = async () => {
      fetch(`http://localhost:3333/rutas`)
        .then((response) => response.json())
        .then((data) => {
          setData(data?.data || []);
        })
        .catch(() => toast.error("Error al cargar los datos"));
    };
    load();
  }, []);
  useEffect(() => {
    if (comienzoLatitud && destinoLatitud) {
      getRoute(
        [parseFloat(comienzoLongitud), parseFloat(comienzoLatitud)],
        [parseFloat(destinoLongitud), parseFloat(destinoLatitud)]
      ).then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          setRouteGeoJson({
            type: "Feature",
            geometry: route.geometry,
          });
          setDistance(route.distance);
          setDuration(route.duration);
        }
      });
    }
    const usuarioString = localStorage.getItem("user");
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        
        setUserId(parseFloat(usuario.id)); // Si el id es numérico
      } catch (error) {
        console.error("Error al parsear usuario:", error);
      }
    }
  }, [comienzoLatitud, destinoLatitud]);

  const filter = data.filter((value) =>
    value.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  const generaInfo = (trans: string) => {
    if (trans === "caminata") {
      return setCalCo2(0);
    }
    if (trans === "bicicleta") {
      return setCalCo2(0);
    }
    if (trans === "transporte_publico") {
      return setCalCo2(((distance! * 28.4) / 1000).toFixed(1));
    }
  };

  const saveRecorrido = () => {
    if (!idRu) return toast.error("Selecciona una ruta");
    const nowFecha = new Date();
    const data = {
      fecha: nowFecha.toISOString(),
      distancia: parseFloat(distance?.toFixed(2)),
      tiempo_minutos: (duration / 60).toFixed(0),
      co2: calCo2 === 0 ? 1 : parseFloat(calCo2).toFixed(2),
      ruta_id: idRu,
      usuario_id: userId,
    };
    try{
      fetch("http://localhost:3333/recorrido", {
        method: "POST",
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Recorrido creado");
      navigate('/')
    } catch (e) {
      toast.error("Error al crear la ruta");
    }
  };
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="flex flex-col md:flex-row gap-8">
        {/* SIDEBAR - 20% en desktop, full width en móvil */}
        <aside className="w-full md:w-[20vw] max-w-[380px] flex flex-col">
          <h1 className="text-3xl font-extrabold text-green-700 mb-4">
            Selecciona tu ruta
          </h1>

          {/* Buscador */}
          <input
            type="text"
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar ruta..."
            className="mb-4 px-4 py-2 border border-green-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 w-full"
          />

          {/* Lista de tarjetas - controla altura con max-h y scroll interno */}
          <div
            className="space-y-4 overflow-y-auto pr-2"
            style={{ maxHeight: "70vh" }}
          >
            {filter.length > 0 ? (
              filter.map((value) => (
                <div
                  key={value.idRuta}
                  onClick={() => {
                    setVerMap(true);
                    setComienzoLatitud(value.origenLatitud);
                    setComienzoLongitud(value.origenLongitud);
                    setDestinoLatitud(value.destinoLatitud);
                    setDestinoLongitud(value.destinoLongitud);
                    setViewState({
                      longitude: parseFloat(value.origenLongitud),
                      latitude: parseFloat(value.origenLatitud),
                      zoom: 13,
                    });
                    setIdRu(value.idRuta);
                    generaInfo(value.transporte);
                  }}
                  className="w-full cursor-pointer p-4 bg-white rounded-lg shadow-md border border-green-100 hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <h2 className="text-lg font-semibold text-green-700">
                    {value.nombre}
                  </h2>
                  <h2 className="text-lg font-semibold text-green-700">
                    {value.transporte === "transporte_publico"
                      ? "transporte publico"
                      : value.transporte}
                  </h2>
                  <p className="text-gray-500 text-sm">Haz clic para ver más</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No se encontraron rutas</p>
            )}
          </div>
        </aside>
        {distance !== null && duration !== null && (
          <div className=" flex flex-col  justify-center  items-center mb-4 p-3 bg-white rounded-lg h-max-screen ">
            <div className="mb-4 p-3 bg-white rounded-lg text-green-800 font-semibold">
              <div>
                Distancia: {(distance / 1000).toFixed(2)} km <br />
              </div>
              <div>Tiempo estimado: {(duration / 60).toFixed(1)} min</div>
              <div>Co2 generado g: {calCo2} por recorrido</div>
            </div>
            <div>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400 hover:animate-pulse transition"
                onClick={() => saveRecorrido()}
              >
                Quiero hacer esta ruta
              </button>
            </div>
          </div>
        )}

        {/* MAIN - mapa (flexible) */}
        <main className="flex-1 bg-white rounded-lg shadow-md border border-green-100 p-6">
          {verMap ? (
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapStyle="mapbox://styles/mapbox/streets-v12"
              mapboxAccessToken="pk.eyJ1Ijoic2FudGlhZ29weCIsImEiOiJjbWU0ZHpoY3IwZ3NvMm9wdXRwdHI2ajd6In0.XLsp5NQ8E_MfK7AwUPi5_Q"
              className="w-full h-[60vh] md:h-[85vh] rounded-lg"
            >
              <NavigationControl position="top-left" />
              {comienzoLatitud && (
                <Marker
                  longitude={parseFloat(comienzoLongitud)}
                  latitude={parseFloat(comienzoLatitud)}
                  color="red"
                />
              )}
              {destinoLatitud && (
                <Marker
                  longitude={parseFloat(destinoLongitud)}
                  latitude={parseFloat(destinoLatitud)}
                  color="blue"
                />
              )}
              {routeGeoJson && (
                <Source id="route" type="geojson" data={routeGeoJson}>
                  <Layer
                    id="routeLine"
                    type="line"
                    paint={{
                      "line-color": "#ff0000",
                      "line-width": 4,
                    }}
                  />
                </Source>
              )}
            </Map>
          ) : (
            <div className="flex items-center justify-center h-[60vh] text-gray-500">
              Selecciona una ruta para ver el mapa
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Recorridos;
