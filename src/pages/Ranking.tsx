import React, { useEffect, useState } from "react";

const Ranking: React.FC = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      fetch("http://localhost:3333/ranking")
        .then((res) => res.json())
        .then((dat) => setData(dat.data));
    };
    getData();
  }, []);

  return (
    <div className="p-6 bg-green-50 min-h-screen">
      <h1 className="text-3xl font-bold text-green-700 mb-2">🏆 Ranking</h1>
      <p className="text-gray-700 mb-6">
        Mira tu posición entre los usuarios que más cuidan el medio ambiente.
      </p>

      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        <div className="grid grid-cols-3 bg-green-100 p-3 font-semibold text-green-900">
          <span>Posición</span>
          <span>Usuario</span>
          <span>Puntos</span>
        </div>

        {data.map((value, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 p-3 border-b last:border-none ${
              index === 0
                ? "bg-yellow-100"
                : index === 1
                ? "bg-gray-100"
                : index === 2
                ? "bg-orange-100"
                : ""
            }`}
          >
            <span className="font-bold text-lg">#{index + 1}</span>
            <span className="truncate">{value.usuario.email}</span>
            <span className="font-semibold text-green-700">{value.puntos}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
