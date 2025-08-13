import { useState, useEffect } from "react";

interface Props {
  initialData?: { nombre: string; descripcion: string };
  onSubmit: (data: { nombre: string; descripcion: string }) => void;
}

export default function LogrosForm({ initialData, onSubmit }: Props) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre);
      setDescripcion(initialData.descripcion);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert("Todos los campos son obligatorios");
      return;
    }
    onSubmit({ nombre, descripcion });
    setNombre("");
    setDescripcion("");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          type="text"
          className="border rounded p-2 w-full"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          className="border rounded p-2 w-full"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
}
