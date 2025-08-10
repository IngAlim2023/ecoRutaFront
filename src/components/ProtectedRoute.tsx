import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { usuarioService } from "../services/usuariosService";
import type { VerifyTokenResponse } from "../services/usuariosService"; 

export default function ProtectedRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const result: VerifyTokenResponse = await usuarioService.verifyToken(token);
        
        setIsAuthenticated(result.msg === "Autorizado");

        if (result.msg !== "Autorizado") {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    verifyToken();
  }, [token]);

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        Verificando autenticación...
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
