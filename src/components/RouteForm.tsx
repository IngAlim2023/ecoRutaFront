import { useState } from "react";

interface RouteFormProps {
  onSubmit: (data: { origen: string; destino: string; medio: string }) => void;
}

const RouteForm: React.FC<RouteFormProps> = ({ onSubmit }) => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [medio, setMedio] = useState("bicicleta");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ origen, destino, medio });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md space-y-4">
      <input
        type="text"
        placeholder="Origen"
        value={origen}
        onChange={(e) => setOrigen(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <input
        type="text"
        placeholder="Destino"
        value={destino}
        onChange={(e) => setDestino(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        value={medio}
        onChange={(e) => setMedio(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="bicicleta">Bicicleta</option>
        <option value="caminar">Caminar</option>
        <option value="transporte_publico">Transporte Público</option>
      </select>
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Planificar Ruta
      </button>
    </form>
  );
};

export default RouteForm;
