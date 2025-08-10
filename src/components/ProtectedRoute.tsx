import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { usuarioService } from "../services/usuariosService";
import type { VerifyTokenResponse } from "../services/usuariosService";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}
