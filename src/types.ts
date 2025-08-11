export interface Ruta {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "caminata" | "bicicleta" | "transporte";
  distanciaKm: number;
  tiempoEstimadoMin: number;
}

export interface Recorrido {
  id: number;
  idRuta: number;
  fecha: string;
  distanciaRecorridaKm: number;
  tiempoEmpleadoMin: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
export interface Role {
  id: number;
  nombre: string;
}