import api from "./api";

export const getLogros = async () => {
  const res = await api.get("/logros");
  return res.data;
};
