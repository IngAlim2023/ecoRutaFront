import React, { useEffect, useState } from "react"
import { getRoles, createRole, updateRole, deleteRole, type Role } from "../services/roles"
import RoleForm from "../components/RoleForm"

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const data = await getRoles()
      setRoles(data)
      setError("")
    } catch (err) {
      console.error("Error fetching roles:", err)
      setError("Error al cargar los roles")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreate = async (data: { nombre: string }) => {
    try {
      await createRole(data)
      setShowForm(false)
      await fetchRoles()
    } catch (err) {
      console.error("Error creating role:", err)
      setError("Error al crear el rol")
    }
  }

  const handleUpdate = async (data: { nombre: string }) => {
    if (!selectedRole?.id) {
      setError("Rol no seleccionado o ID inválido")
      return
    }
    try {
      await updateRole(selectedRole.id, data)
      setShowForm(false)
      setSelectedRole(null)
      await fetchRoles()
    } catch (err) {
      console.error("Error updating role:", err)
      setError("Error al actualizar el rol")
    }
  }

  const handleDelete = async (id: number) => {
    if (!id) {
      setError("ID inválido para eliminar")
      return
    }
    if (!window.confirm("¿Seguro que quieres eliminar este rol?")) return
    try {
      await deleteRole(id)
      await fetchRoles()
    } catch (err) {
      console.error("Error deleting role:", err)
      setError("Error al eliminar el rol")
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Roles</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!showForm ? (
        <button
          onClick={() => {
            setSelectedRole(null)
            setShowForm(true)
          }}
          className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Crear Rol
        </button>
      ) : (
        <RoleForm
          role={selectedRole || undefined}
          onSubmit={selectedRole ? handleUpdate : handleCreate}
          onCancel={() => {
            setShowForm(false)
            setSelectedRole(null)
          }}
        />
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={`role-${role.id} || math.random().toString(36)}.substr(2.9)`}>
              <td className="border px-4 py-2">{role.id}</td>
              <td className="border px-4 py-2">{role.nombre}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedRole(role)
                    setShowForm(true)
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No hay roles registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default RolesPage

