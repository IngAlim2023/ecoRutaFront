import React, { useState } from 'react';

interface RoleFormProps {
  role?: { id: number; nombre: string };
  onSubmit: (data: { nombre: string }) => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState(role?.nombre || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre es requerido');
      return;
    }
    onSubmit({ nombre });
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-md w-full">
      <h2 className="text-lg font-bold mb-4">
        {role ? 'Editar Rol' : 'Crear Rol'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nombre del Rol
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={nombre}
            onChange={(e) => {
              setNombre(e.target.value);
              setError('');
            }}
            placeholder="Ej: Administrador"
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleForm;
