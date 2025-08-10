import axios from "axios";

// Definición de las interfaces para los datos que se envían y se reciben
export interface Usuario {
  id_usuario?: number;
  email: string;
  password?: string;
  auth_provider?: string;
}

export interface AuthResponse {
  msg: string; // Tu backend usa 'msg' en lugar de 'message'
  token?: string;
  usuario?: {
    id: number;
    email: string;
  };
}

export interface VerifyTokenResponse {
  msg: string;
  token: string;
  usuario: {
    id: number;
    email: string;
  };
}

const API_URL = "http://localhost:3333";

export const usuarioService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
      
        return {
          msg: error.response.data.msg || "Error al iniciar sesión",
        };
      }
      return {
        msg: "Error de red al intentar iniciar sesión.",
      };
    }
  },

  /**
   * Crea un nuevo usuario en la base de datos.
   * @param data - Los datos del nuevo usuario.
   * @returns La respuesta del backend.
   */
  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, { 
        email, 
        password,
        auth_provider: "email" 
      });
      return {
        msg: "Usuario creado exitosamente",
        ...response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return {
          msg: error.response.data.msg || "Error al registrar usuario"
        };
      }
      return {
        msg: "Error de red al registrar usuario"
      };
    }
  },

  /**
   * Verifica la validez del token de sesión.
   * @param token - El token JWT.
   * @returns La respuesta de verificación.
   */
  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const res = await axios.post(`${API_URL}/verifyToken`, { token });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new Error(error.response.data.msg || "Token inválido o expirado");
      }
      throw new Error("Error de red al verificar el token");
    }
  },
};
