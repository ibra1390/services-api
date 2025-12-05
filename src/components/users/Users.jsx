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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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

  // Filtrar usuarios por rol y búsqueda (memoizado)
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Filtrar por rol
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => {
        const roleName =
          user.role && typeof user.role === "object" && user.role.name
            ? user.role.name
            : user.role || "Usuario";
        return roleName.toLowerCase() === roleFilter.toLowerCase();
      });
    }

    // Filtrar por término de búsqueda (nombre o apellido)
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((user) => {
        const fullName = `${user.f_name || ""} ${user.s_name || ""} ${
          user.f_lastname || ""
        } ${user.s_lastname || ""}`;
        return (
          fullName.toLowerCase().includes(search) ||
          (user.email && user.email.toLowerCase().includes(search))
        );
      });
    }

    return filtered;
  }, [users, roleFilter, searchTerm]);

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

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [roleFilter, searchTerm]);

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
          await dataService().update(userId, formData);
        } else {
          await dataService().create(formData);
        }

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

      {/* Barra de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          disabled={loading || !!error}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-gray-600">Cargando usuarios...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-lg shadow">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      ) : (
        <>
          <Table headers={HEADERS}>
            {currentUsers.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </Table>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-4 py-3 bg-white rounded-lg shadow">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{startIndex + 1}</span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredUsers.length)}
                </span>{" "}
                de <span className="font-medium">{filteredUsers.length}</span>{" "}
                resultados
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    // Mostrar solo algunas páginas alrededor de la actual
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded-lg ${
                            currentPage === page
                              ? "bg-indigo-600 text-white"
                              : "border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 py-1">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
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
