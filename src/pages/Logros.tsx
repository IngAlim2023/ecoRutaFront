import { useEffect, useState } from "react";
import { getLogros, createLogro, updateLogro, deleteLogro } from "../services/logros";

interface Logro {
  id: number; // ✅ ahora usamos "id"
  nombre: string;
  descripcion: string;
}

export default function Logros() {
  const [logros, setLogros] = useState<Logro[]>([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  const fetchLogros = async () => {
    try {
      const data = await getLogros();
      setLogros(data || []);
    } catch (error) {
      console.error("❌ Error cargando logros:", error);
    }
  };

  useEffect(() => {
    fetchLogros();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !descripcion.trim()) {
      alert("Completa todos los campos");
      return;
    }

    try {
      if (editId !== null) {
        await updateLogro(editId, { nombre, descripcion });
        setEditId(null);
      } else {
        await createLogro({ nombre, descripcion });
      }
      setNombre("");
      setDescripcion("");
      fetchLogros();
    } catch (error) {
      console.error("❌ Error guardando logro:", error);
    }
  };

  const handleEdit = (logro: Logro) => {
    setEditId(logro.id);
    setNombre(logro.nombre);
    setDescripcion(logro.descripcion);
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que quieres eliminar este logro?")) {
      try {
        await deleteLogro(id);
        fetchLogros();
      } catch (error) {
        console.error("❌ Error eliminando logro:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setNombre("");
    setDescripcion("");
  };

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Logros</h1>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <div className="flex gap-2">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            {editId !== null ? "Actualizar" : "Crear"}
          </button>
          {editId !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla */}
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-green-200">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {logros.length > 0 ? (
            logros.map((logro) => (
              <tr key={logro.id}>
                <td className="border p-2">{logro.id}</td>
                <td className="border p-2">{logro.nombre}</td>
                <td className="border p-2">{logro.descripcion}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(logro)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(logro.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No hay logros
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
