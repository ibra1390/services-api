import React, { useEffect, useState, useCallback, useMemo } from "react";
import Table from "../common/Table";
import { dataService } from "../../services/dataService";
import UserHeader from "./UserHeader";
import UserFilter from "./UserFilter";
import UserTableRow from "./UserTableRow";
import UserModal from "./UserModal";
import UserDetailModal from "./UserDetailModal";

const HEADERS = [
  "ID",
  "Nombre",
  "Ap. Paterno",
  "Ap. Materno",
  "Email",
  "Rol",

  "Acciones",
];

export default function Users() {
  // Estados
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Función para obtener usuarios
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dataService().getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Filtrar usuarios por rol (memoizado)
  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => {
      // Extraer el nombre del rol si es un objeto
      const roleName =
        user.role && typeof user.role === "object" && user.role.name
          ? user.role.name
          : user.role || "Usuario";
      return roleName.toLowerCase() === roleFilter.toLowerCase();
    });
  }, [users, roleFilter]);

  // Obtener roles únicos (memoizado)
  const uniqueRoles = useMemo(() => {
    const roles = users.map((user) => {
      // Si user.role es un objeto con name, extraer el name
      if (user.role && typeof user.role === "object" && user.role.name) {
        return user.role.name;
      }
      // Si es un string, usarlo directamente
      return user.role || "Usuario";
    });
    return ["all", ...new Set(roles)];
  }, [users]);

  // Handlers
  const handleView = useCallback((userId) => {
    setSelectedUserId(userId);
    setIsDetailModalOpen(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (userId) => {
      if (
        window.confirm("¿Estás seguro de que deseas eliminar este usuario?")
      ) {
        try {
          await dataService().delete(userId);
          console.log("Usuario eliminado:", userId);
          // Recargar la lista de usuarios
          await fetchUsers();
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      }
    },
    [fetchUsers]
  );

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleModalSubmit = useCallback(
    async (formData, userId = null) => {
      try {
        if (userId) {
          // Editar usuario existente
          await dataService().update(userId, formData);
          console.log("Usuario actualizado:", userId);
        } else {
            console.log("ENVIANDO AL BACKEND:", formData);

          // Crear nuevo usuario
          await dataService().create(formData);
          console.log("Usuario creado:", formData);
        }

        // Recargar la lista de usuarios
        await fetchUsers();
        handleCloseModal();
      } catch (error) {
        console.error("Error al guardar usuario:", error);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    },
    [fetchUsers, handleCloseModal]
  );

  return (
    <div className="p-8">
      <UserHeader onCreateUser={handleCreateUser} />

      <UserFilter
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
        uniqueRoles={uniqueRoles}
        disabled={loading || !!error}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-gray-600">Cargando usuarios...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      ) : (
        <Table headers={HEADERS}>
          {filteredUsers.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Table>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        user={selectedUser}
      />

      <UserDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        userId={selectedUserId}
      />
    </div>
  );
}
