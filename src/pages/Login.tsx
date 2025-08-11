import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usuarioService } from "../services/usuariosService";
import eco from "../assets/imgs/eco.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await usuarioService.login(email, password);

    if (result.token && result.usuario) {
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.usuario));
      navigate("/");
    } else {
      setError(result.msg || "Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-100 via-white to-green-50 p-4">
      <div className="w-full max-w-md  bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-emerald-200 p-8 ">
        <div className=" flex flex-col justify-center items-center">
          <img
            src={eco}
            alt="404 Not Found"
            className="w-20 mb-6 animate-pulse transition-transform duration-300 hover:scale-105"
            style={{
              filter:
                "invert(54%) sepia(83%) saturate(421%) hue-rotate(85deg) brightness(92%) contrast(85%)",
            }}
          />
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
            Iniciar Sesión
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border-0 border-b-2 border-gray-400 focus:border-green-400 focus:ring-0 outline-none"
              placeholder="Correo electonico"
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

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg mt-4 font-semibold text-white shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:scale-[0.98]"
            }`}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-green-600 font-medium hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
