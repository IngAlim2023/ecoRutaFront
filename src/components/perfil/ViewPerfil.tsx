import React, { useState, useEffect } from "react";

const ViewPerfil: React.FC = () => {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setLoading(false);
      return;
    }

    let json: Record<string, any>;
    try {
      json = JSON.parse(storedUser);
    } catch {
      setLoading(false);
      return;
    }

    if (json?.id) {
      fetch(`http://localhost:3333/perfil/${json.id}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data?.data?.[0] || null);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading)
    return (
      <div className="text-center text-gray-500 mt-10">
        ⏳ Cargando tu perfil...
      </div>
    );

  if (!user) {
    return (
      <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
        <p className="text-red-500 font-semibold">
          🚀 Debes editar tu información para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-r from-green-100 via-white to-green-50 shadow-lg rounded-2xl max-w-md mx-auto transform transition-all hover:scale-[1.02]">
      {/* Avatar */}
      <div className="flex justify-center">
        <img
          src={`https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=34D399&color=fff&size=120`}
          alt="Avatar"
          className="rounded-full shadow-md border-4 border-white"
        />
      </div>

      {/* Nombre */}
      <h1 className="text-3xl font-bold text-center text-green-700 mt-4">
        {user.nombre} {user.apellido}
      </h1>

      {/* Nickname */}
      <p className="text-center text-gray-500">@{user.nickname}</p>

      {/* Datos */}
      <div className="mt-6 space-y-3">
        <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between">
          <span className="font-medium text-gray-600">Nivel</span>
          <span className="text-green-700 font-semibold capitalize">
            {user.nivel}
          </span>
        </div>

        {user.ultima_vez && (
          <div className="bg-white p-3 rounded-lg shadow-sm flex justify-between">
            <span className="font-medium text-gray-600">Última vez</span>
            <span className="text-gray-800">
              {new Date(user.ultima_vez).toLocaleString("es-ES", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        )}
      </div>

    </div>
  );
};

export default ViewPerfil;
