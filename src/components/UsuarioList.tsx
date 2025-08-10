import axios from "axios";

const API_URL = "http://localhost:3333";

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  usuario?: {
    id: number;
    email: string;
  };
}

export interface Usuario {
  id_usuario?: number;
  email: string;
  password?: string;
  auth_provider?: string;
}

export const usuarioService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return {
        success: true,
        token: response.data.token,
        usuario: response.data.usuario,
        message: response.data.msg
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.msg || "Error al iniciar sesión"
      };
    }
  },

  async register(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, {
        email,
        password,
        auth_provider: "email"
      });
      return {
        success: true,
        message: response.data.msg || "Usuario registrado exitosamente",
        token: response.data.token,
        usuario: response.data.usuario
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.msg || "Error al registrar usuario"
      };
    }
  },

  async verifyToken(token: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/verifyToken`, { token });
      return {
        success: true,
        usuario: response.data.usuario,
        message: response.data.msg
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.msg || "Token inválido o expirado"
      };
    }
  }
};