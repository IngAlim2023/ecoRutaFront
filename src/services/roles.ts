import api from './api';

export interface Role {
  id: number;
  nombre: string;
}

export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get('/roles');
  const rolesFromApi = response.data.data || [];
  
  // Normalizamos la estructura por si el backend usa otros nombres
  return rolesFromApi.map((r: any) => ({
    id: r.id ?? r.id_rol ?? r.ID ?? 0,
    nombre: r.nombre ?? r.Nombre ?? ''
  }));
};

export const createRole = async (data: { nombre: string }): Promise<Role> => {
  const response = await api.post('/roles', data);
  const r = response.data.data;
  return {
    id: r.id ?? r.id_rol ?? r.ID ?? 0,
    nombre: r.nombre ?? r.Nombre ?? ''
  };
};

export const updateRole = async (id: number, data: { nombre: string }): Promise<Role> => {
  const response = await api.put(`/roles/${id}`, data);
  const r = response.data.data;
  return {
    id: r.id ?? r.id_rol ?? r.ID ?? 0,
    nombre: r.nombre ?? r.Nombre ?? ''
  };
};

export const deleteRole = async (id: number): Promise<void> => {
  await api.delete(`/roles/${id}`);
};
