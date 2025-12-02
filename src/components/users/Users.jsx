import React, { useEffect, useState, useCallback, useMemo } from "react";
import Table from "../common/Table";
import { dataService } from "../../services/dataService";
import UserHeader from "./UserHeader";
import UserFilter from "./UserFilter";
import UserTableRow from "./UserTableRow";
import UserModal from "./UserModal";

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

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener usuarios
  const fetchUsers = async () => {
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
  };

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
    console.log("Ver usuario:", userId);
    // TODO: Implementar vista de detalles
  }, []);

  const handleEdit = useCallback((user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback((userId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      console.log("Eliminar usuario:", userId);
      // TODO: Implementar eliminación
    }
  }, []);

  const handleCreateUser = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleModalSubmit = useCallback(
    (formData) => {
      console.log("Datos del formulario:", formData);
      // TODO: Implementar crear/editar usuario
      handleCloseModal();
    },
    [handleCloseModal]
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
    </div>
  );
}
