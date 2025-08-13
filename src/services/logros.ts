import api from "./api";

export const getLogros = async () => {
  const res = await api.get("/logros");
  return res.data.data; // ✅ ya vienen con {id, nombre, descripcion}
};

export const getLogroById = async (id: number) => {
  const res = await api.get(`/logros/${id}`);
  return res.data.data;
};

export const createLogro = async (data: { nombre: string; descripcion: string }) => {
  const res = await api.post("/logros", data);
  return res.data.data;
};

export const updateLogro = async (id: number, data: { nombre?: string; descripcion?: string }) => {
  const res = await api.put(`/logros/${id}`, data);
  return res.data.data;
};

export const deleteLogro = async (id: number) => {
  const res = await api.delete(`/logros/${id}`);
  return res.data;
};
