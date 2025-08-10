import api from "./api";
import type { Recorrido, ApiResponse } from "../types";

// Obtener todos los recorridos
export const getRecorridos = async (): Promise<Recorrido[]> => {
  const response = await api.get<ApiResponse<Recorrido[]>>("/recorridos");
  return response.data.data;
};

// Registrar un recorrido
export const createRecorrido = async (nuevoRecorrido: Omit<Recorrido, "id">): Promise<Recorrido> => {
  const response = await api.post<ApiResponse<Recorrido>>("/recorridos", nuevoRecorrido);
  return response.data.data;
};

// Obtener un recorrido por ID
export const getRecorridoById = async (id: number): Promise<Recorrido> => {
  const response = await api.get<ApiResponse<Recorrido>>(`/recorridos/${id}`);
  return response.data.data;
};
