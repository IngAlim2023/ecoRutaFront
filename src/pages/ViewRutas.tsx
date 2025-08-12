import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";

const ViewRutas: React.FC = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const load = async () => {
      fetch(`http://localhost:3333/rutas`)
        .then((response) => response.json())
        .then((data) => {
          setData(data?.data || null);
        })
        .catch(() => toast.error("Error al cargar los datos"));
    };
    load();
  }, []);
  const ExpandedComponent = ({ data }) => (
    <pre>{JSON.stringify(data, null, 2)}</pre>
  );

  const columns = [
    {
      name: "codigo",
      selector: (row) => row.idRuta,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
    },
    {
      name: "Transporte",
      selector: (row) => row.transporte,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2 justify-center w-full">
          <button
            className="w-full py-2 px-2  mt-1 rounded-md text-white font-xs bg-cyan-600 hover:bg-cyan-700"
            onClick={() => console.log(row.idRuta)}
          >
            Ver
          </button>
          <button className="w-full py-2 px-2  mt-1 rounded-md text-white font-xs bg-red-600 hover:bg-red-700">
            Eliminar
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-4">
          Rutas Ecologicas
        </h1>
      <div className="p-8">
        <DataTable
          columns={columns}
          data={data}
          pagination
          expandableRows
          expandableRowsComponent={ExpandedComponent}
        />
      </div>
    </div>
  );
};

export default ViewRutas;
