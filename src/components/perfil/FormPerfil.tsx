import React, { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  nombre: string;
  nombreRequired: string;
  apellido: string;
  apellidoRequired: string;
  nickname: string;
  nicknameRequired: string;
  nivel: string;
  nivelRequired: string;
  usuario_id?: number;
  ultima_vez?: Date;
};
interface Props {
  form: boolean;
  setForm: (form:boolean) => void
}

const FormPerfil: React.FC<Props> = ({form, setForm}) => {
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [nickUso, setNickUso] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    data.usuario_id = user?.id;
    const fecha = new Date();
    data.ultima_vez = fecha;

    if(!nickUso) return alert('El nickname esta en uso')
    fetch("http://localhost:3333/perfil/", {
      method: "POST",
      body: JSON.stringify(data), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch((error) => console.error("Error:", error))
      .then((response) => {console.log("Success:", response); setForm(!form)});
  };

  const verify = async (e: any) => {
    if (e.target.value === "") return setNickUso(false);
    fetch(`http://localhost:3333/perfil/nick/${e.target.value}`)
      .then((response) => response.json())
      .then((data) => { console.log(data); setNickUso(data.disponible)});
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Crear Perfil
        </h2>

        <input
          type="text"
          placeholder="Nombre"
          {...register("nombre", { required: true })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Apellido"
          {...register("apellido", { required: true })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="text"
          placeholder="Nickname"
          {...register("nickname", { required: true })}
          onChange={(e) => verify(e)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {!nickUso && <p className="text-red-500"> nickname no disponible</p>}

        <select
          {...register("nivel", { required: true })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Selecciona el nivel</option>
          <option value="alto">Alto</option>
          <option value="medio">Medio</option>
          <option value="bajo">Bajo</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default FormPerfil;
