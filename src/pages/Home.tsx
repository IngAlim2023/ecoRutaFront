import MapView from "../components/MapView";

export default function Home() {
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Bienvenido a EcoRuta</h1>
      <p className="text-gray-700 mb-6">
        Planifica rutas eco-amigables, registra tus recorridos y gana incentivos.
      </p>
      <MapView lng={-74.5} lat={40} /> {/* Ejemplo: Nueva York */}
    </div>
  );
}