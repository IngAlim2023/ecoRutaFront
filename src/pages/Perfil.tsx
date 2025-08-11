import React, { useState, useEffect } from "react";
import FormPerfil from "../components/perfil/FormPerfil";
import ViewPerfil from "../components/perfil/ViewPerfil";



const Perfil: React.FC = () => {
  const [form, setForm] = useState<boolean>(false);

  const [user, setUser] = useState<Record<string, any> | null>(null);
  
    
    useEffect(() => {
      const storedUser = localStorage.getItem("user");
      const json = JSON.parse(storedUser);
      if (json.id) {
        fetch(`http://localhost:3333/perfil/${json.id}`)
          .then((response) => response.json())
          .then((data) => setUser(data.data));
      }
    }, []);
  return (
    <div className="p-6 bg-green-50 min-h-screen">
      {form ? (
        <div className="flex justify-center items-center">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            {/* Header con botón volver */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setForm(false)}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                ← Volver
              </button>
              
              <span className="w-8"></span> {/* espacio para equilibrar */}
            </div>

            {/* Aquí el form */}
            <FormPerfil form={form} setForm={setForm}/>
          </div>
        </div>
      ) : (
        <div>
          <ViewPerfil />
          {user?.length === 0 &&(<button onClick={() => setForm(true)}>Crear Perfil</button>)}
          
        </div>
      )}
    </div>
  );
};

export default Perfil;
