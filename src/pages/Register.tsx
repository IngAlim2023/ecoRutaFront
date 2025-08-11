import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usuarioService } from "../services/usuariosService";
import register from "../assets/imgs/register.svg";
import toast from "react-hot-toast";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password != password2) {
      setLoading(false);
      return toast.error("Contraseña Incorrecta");
    }

    const result = await usuarioService.register(email, password);

    toast.success('Usuario creado')
    if (result.msg === "Creado") {
      setSuccess("Registro exitoso. Redirigiendo...");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setError(result.msg || "Error en el registro");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-4">
      <div className="w-full max-w-md  bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-emerald-200 p-8 ">
        <div className=" flex flex-col justify-center items-center">
          <img
            src={register}
            alt="404 Not Found"
            className="w-20 mb-6 animate-pulse transition-transform duration-300 hover:scale-105"
            style={{
              filter:
                "invert(54%) sepia(83%) saturate(421%) hue-rotate(85deg) brightness(92%) contrast(85%)",
            }}
          />
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
            Registro
          </h2>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-400 focus:border-green-400 focus:ring-0 outline-none"
              placeholder="Correo electronico"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-400 focus:border-green-400 focus:ring-0 outline-none"
              placeholder="Contraseña"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-400 focus:border-green-400 focus:ring-0 outline-none"
              placeholder="Confirma contraseña"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4  mt-6 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
      </div>
    </div>
  );
}
