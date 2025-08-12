import api from './api'

export interface Role {
  id: number
  nombre: string
}

export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await api.get('/roles')
    return response.data.data || []
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw error
  }
}

export const createRole = async (data: { nombre: string }): Promise<Role> => {
  try {
    const response = await api.post('/roles', data)
    return response.data.data
  } catch (error) {
    console.error('Error creating role:', error)
    throw error
  }
}

export const updateRole = async (id: number, data: { nombre: string }): Promise<Role> => {
  if (!id) throw new Error('ID is required for update')
  try {
    const response = await api.put(`/roles/${id}`, data)
    return response.data.data
  } catch (error) {
    console.error('Error updating role:', error)
    throw error
  }
}

export const deleteRole = async (id: number): Promise<void> => {
  if (!id) throw new Error('ID is required for delete')
  try {
    await api.delete(`/roles/${id}`)
  } catch (error) {
    console.error('Error deleting role:', error)
    throw error
  }
}