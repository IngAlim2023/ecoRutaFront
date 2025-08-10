import { useState, useEffect } from "react";
import { usuarioService } from "../services/usuariosService";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, la verificación no es necesaria.
    if (!token) {
      setLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        // Ahora, como ya verificamos que 'token' no es null,
        // podemos pasarlo de forma segura a la función.
        const result = await usuarioService.verifyToken(token);

        // Tu backend devuelve 'usuario' dentro del objeto 'result'
        setUser(result.usuario);
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    // Usamos el servicio de login para obtener el token y los datos del usuario
    const { token, usuario } = await usuarioService.login(email, password);

    if (token && usuario) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(usuario));
      setUser(usuario);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, loading, login, logout };
}
