import api from "./api";
import type { Ruta, ApiResponse } from "../types";

// Obtener todas las rutas
export const getRutas = async (): Promise<Ruta[]> => {
  const response = await api.get<ApiResponse<Ruta[]>>("/rutas");
  return response.data.data;
};

// Crear una ruta
export const createRuta = async (nuevaRuta: Omit<Ruta, "id">): Promise<Ruta> => {
  const response = await api.post<ApiResponse<Ruta>>("/rutas", nuevaRuta);
  return response.data.data;
};

// Obtener una ruta por ID
export const getRutaById = async (id: number): Promise<Ruta> => {
  const response = await api.get<ApiResponse<Ruta>>(`/rutas/${id}`);
  return response.data.data;
};
